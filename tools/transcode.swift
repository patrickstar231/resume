// Zero-install H.264 transcoder for this site's media slots.
// There is no ffmpeg on this machine, and macOS's built-in `avconvert` cannot target a bitrate,
// so the <=600KB / <=2MB budgets are unreachable with it.
//
//   swiftc -O tools/transcode.swift -o /tmp/transcode
//   /tmp/transcode --in raw-media/Hero.mp4 --out public/media/hero-loop.mp4 --bitrate 1000000
//   /tmp/transcode --in raw-media/footer.mp4 --out public/media/footer-reverse.mp4 \
//       --reverse --bitrate 700000
//
// Video only: audio tracks are dropped, since every <video> here is muted.

import AVFoundation
import CoreMedia
import CoreVideo
import Foundation

func die(_ msg: String) -> Never {
    FileHandle.standardError.write("transcode failed: \(msg)\n".data(using: .utf8)!)
    exit(1)
}

func check(_ status: OSStatus, _ what: String) {
    if status != noErr { die("\(what) returned \(status)") }
}

var inPath = ""
var outPath = ""
var bitrate = 1_000_000
var start = 0.0
var duration = 0.0
var reverse = false
var outFps = 0.0

let usage = "usage: transcode --in A --out B [--bitrate N] [--start S] [--duration S] [--reverse] [--fps N]"

func requireValue(_ argv: [String], _ index: Int, _ flag: String) -> String {
    guard index + 1 < argv.count else { die("\(flag) needs a value") }
    return argv[index + 1]
}

func parseDouble(_ argv: [String], _ index: Int, _ flag: String) -> Double {
    let raw = requireValue(argv, index, flag)
    guard let n = Double(raw) else { die("\(flag) needs a number, got \(raw)") }
    return n
}

let argv = Array(CommandLine.arguments.dropFirst())
var i = 0
while i < argv.count {
    let flag = argv[i]
    switch flag {
    case "--reverse":
        reverse = true
        i += 1
        continue
    case "--in":
        inPath = requireValue(argv, i, flag)
    case "--out":
        outPath = requireValue(argv, i, flag)
    case "--bitrate":
        bitrate = Int(parseDouble(argv, i, flag))
    case "--start":
        start = parseDouble(argv, i, flag)
    case "--duration":
        duration = parseDouble(argv, i, flag)
    case "--fps":
        outFps = parseDouble(argv, i, flag)
    default:
        die("unknown flag \(flag)\n\(usage)")
    }
    i += 2
}
guard !inPath.isEmpty, !outPath.isEmpty else { die(usage) }

let asset = AVURLAsset(url: URL(fileURLWithPath: inPath))
guard let track = asset.tracks(withMediaType: .video).first else { die("no video track in \(inPath)") }
let fps = outFps > 0 ? outFps : (track.nominalFrameRate > 0 ? Double(track.nominalFrameRate) : 24)
let frameDur = CMTime(seconds: 1 / fps, preferredTimescale: 600)
let endAt = duration > 0 ? min(start + duration, CMTimeGetSeconds(asset.duration)) : CMTimeGetSeconds(asset.duration)

let reader: AVAssetReader
do {
    reader = try AVAssetReader(asset: asset)
} catch {
    die("reader: \(error)")
}
reader.timeRange = CMTimeRange(start: CMTime(seconds: start, preferredTimescale: 600),
                               end: CMTime(seconds: endAt, preferredTimescale: 600))
let frames = AVAssetReaderTrackOutput(track: track, outputSettings: [
    kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_420YpCbCr8BiPlanarVideoRange
])
// Reversing holds frames across phases, so each one must be our own copy.
frames.alwaysCopiesSampleData = reverse
reader.add(frames)
if !reader.startReading() { die("startReading: \(reader.error?.localizedDescription ?? "unknown")") }

var writer: AVAssetWriter!
var input: AVAssetWriterInput!

func openWriter(_ width: Int, _ height: Int) {
    let url = URL(fileURLWithPath: outPath)
    if FileManager.default.fileExists(atPath: outPath) {
        do { try FileManager.default.removeItem(at: url) } catch { die("remove old output: \(error)") }
    }
    do {
        writer = try AVAssetWriter(outputURL: url, fileType: .mp4)
    } catch {
        die("writer: \(error)")
    }
    input = AVAssetWriterInput(mediaType: .video, outputSettings: [
        AVVideoCodecKey: AVVideoCodecType.h264,
        AVVideoWidthKey: width,
        AVVideoHeightKey: height,
        AVVideoCompressionPropertiesKey: [
            AVVideoAverageBitRateKey: bitrate,
            AVVideoExpectedSourceFrameRateKey: Int(fps),
            AVVideoMaxKeyFrameIntervalKey: max(1, Int(fps * 2)),
        ],
    ])
    input.expectsMediaDataInRealTime = false
    if !writer.canAdd(input) { die("writer rejected the input") }
    writer.add(input)
    if !writer.startWriting() { die("startWriting: \(writer.error?.localizedDescription ?? "unknown")") }
    writer.startSession(atSourceTime: .zero)
}

func rewrap(_ buffer: CVPixelBuffer, _ pts: CMTime) -> CMSampleBuffer {
    var format: CMVideoFormatDescription?
    check(CMVideoFormatDescriptionCreateForImageBuffer(allocator: nil, imageBuffer: buffer,
                                                       formatDescriptionOut: &format),
          "CMVideoFormatDescriptionCreateForImageBuffer")
    var timing = CMSampleTimingInfo(duration: frameDur, presentationTimeStamp: pts, decodeTimeStamp: .invalid)
    var out: CMSampleBuffer?
    check(CMSampleBufferCreateForImageBuffer(allocator: nil, imageBuffer: buffer, dataReady: true,
                                             makeDataReadyCallback: nil, refcon: nil,
                                             formatDescription: format!, sampleTiming: &timing,
                                             sampleBufferOut: &out),
          "CMSampleBufferCreateForImageBuffer")
    return out!
}

var written = 0

// Even with expectsMediaDataInRealTime = false the appends outrun the encoder, and
// appendSampleBuffer throws once its queue fills.
func waitUntilReady() {
    var waited = 0.0
    while !input.isReadyForMoreMediaData {
        if waited > 60 { die("writer stopped accepting frames after \(written) appends") }
        RunLoop.current.run(until: Date().addingTimeInterval(0.005))
        waited += 0.005
    }
}

func emit(_ buffer: CVPixelBuffer, _ pts: CMTime) {
    waitUntilReady()
    if !input.append(rewrap(buffer, pts)) { die("append: \(writer.error?.localizedDescription ?? "unknown")") }
    written += 1
}

func pixels(of sample: CMSampleBuffer) -> CVPixelBuffer {
    guard let pb = CMSampleBufferGetImageBuffer(sample) else { die("sample buffer carries no image") }
    return pb
}

if reverse {
    // 6s at 960x528 is about 110 MB of pixel data — cheaper to hold than to seek backwards.
    var held: [CMSampleBuffer] = []
    while reader.status == .reading, let sample = frames.copyNextSampleBuffer() {
        held.append(sample)
    }
    guard !held.isEmpty else { die("no frames read from \(inPath)") }
    let first = pixels(of: held[0])
    openWriter(CVPixelBufferGetWidth(first), CVPixelBufferGetHeight(first))
    for index in 0..<held.count {
        emit(pixels(of: held[held.count - 1 - index]), CMTimeMultiply(frameDur, multiplier: Int32(index)))
    }
} else {
    var base: CMTime?
    while reader.status == .reading, let sample = frames.copyNextSampleBuffer() {
        let pixel = pixels(of: sample)
        if writer == nil { openWriter(CVPixelBufferGetWidth(pixel), CVPixelBufferGetHeight(pixel)) }
        let pts = CMSampleBufferGetPresentationTimeStamp(sample)
        let origin = base ?? pts
        base = origin
        emit(pixel, CMTimeSubtract(pts, origin))
    }
}

guard writer != nil else { die("nothing was decoded") }
if reader.status == .failed { die("reader: \(reader.error?.localizedDescription ?? "unknown")") }
input.markAsFinished()
let done = DispatchSemaphore(value: 0)
writer.finishWriting { done.signal() }
done.wait()
if writer.status != .completed { die("\(writer.status.rawValue): \(writer.error?.localizedDescription ?? "unknown")") }

let attrs = try? FileManager.default.attributesOfItem(atPath: outPath)
let size = (attrs?[.size] as? Int) ?? 0
print("wrote \(outPath): \(written) frames, \(size / 1024) KiB")
