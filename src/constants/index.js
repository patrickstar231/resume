
import {
  mobile,
  backend,
  creator,
  web,
  az,
  pfizer,
  huawei,
  tencent,
  porsche,
  mercedesbenz,
  pingan,
  ningbo,
  vhall,
  fengfan,
  vokdams,
  cyts,
  porsche1,
  huawei1,
  tencent1,
  
} from "../assets";

export const navLinks = [
  {
    id: "about",
    title: "About",
  },
  {
    id: "work",
    title: "Work",
  },
  {
    id: "contact",
    title: "Contact",
  },
];

const services = [
  {
    title: "Campaign Architect​",
    icon: web,
  },
  {
    title: "Experience Engineer​",
    icon: mobile,
  },
  {
    title: "Backend Growth Stack Specialist​",
    icon: backend,
  },
  {
    title: "Viral Systems Designer​",
    icon: creator,
  },
];

const technologies = [
  {
    name: "Huawei",
    icon: huawei,
  },
  {
    name: "Tencent",
    icon: tencent,
  },
  {
    name: "Porsche",
    icon: porsche,
  },
  {
    name: "MercedesBenz",
    icon: mercedesbenz,
  },
  {
    name: "PingAn",
    icon: pingan,
  },
  {
    name: "NingBo",
    icon: ningbo,
  },
  {
    name: "AstraZeneca",
    icon: az,
  },
  {
    name: "Pfizer",
    icon: pfizer,
  },
];

const experiences = [
  {
    title: "Project Supervisor",
    company_name: "Beijing Weihou Times Technology",
    icon: vhall,
    iconBg: "#1E4A87",
    date: "September 2022 - Present",
    points: [
      "Pioneered hybrid offline-live engagement model achieving 12,000 peak concurrent viewers",
      "Secured 100% contract renewal rate with Huawei through standardized workflows",
      "Developed multichannel distribution playbook with 21 operational standards",
      "Delivered 50+ technical livestreams featured on Huawei Cloud's official website",
    ],
  },
  {
    title: "Sales Director",
    company_name: "Shanghai Fengfan Advertising Media",
    icon: fengfan,
    iconBg: "#F57C00",
    date: "September 2020 - March 2022",
    points: [
      "Achieved 170% YoY revenue growth via integrated events-content-resources strategy",
      "Built award-winning Jifu Awards IP with 32 media partners",
      "Maintained 91% client retention rate (35% above industry average)",
      "Mentored 3 team members to senior management positions",
    ],
  },
  {
    title: "Project Manager",
    company_name: "Vokdams Consulting Shanghai",
    icon: vokdams,
    iconBg: "#388E3C",
    date: "September 2019 - March 2020",
    points: [
      "Curated immersive Porsche 992 'Time Tunnel' exhibition with MR technology",
      "Boosted audience engagement to 65 minutes (3x industry average)",
      "Generated 980M+ Weibo impressions through viral UGC campaign",
      "Partnered with Autohome for live-streamed special coverage",
    ],
  },
  {
    title: "Strategy Manager",
    company_name: "CYTS Linkage PR Consulting",
    icon: cyts,
    iconBg: "#7B1FA2",
    date: "February 2019 - August 2019",
    points: [
      "Directed 3 high-stakes industry forums with $500K+ budgets",
      "Built media matrix with 32 core outlets including Shenzhen TV",
      "Produced 15+ corporate videos with end-to-end creative control",
      "Implemented crisis response protocol resolving issues within 2 hours",
    ],
  },
];

const testimonials = [
  {
    testimonial: "Pan redefined automotive launch events with the Porsche 992 exhibition. Audience engagement tripled industry standards and our global Instagram featured his work - a first for any agency partner.",
    name: "Michael Schmidt",
    designation: "Head of Experiential Marketing",
    company: "Porsche China",
    image: "https://randomuser.me/api/portraits/men/9.jpg",
  },
  {
    "testimonial": "His hybrid streaming model saved our B2B campaigns. Viewer retention doubled, contract renewal hit 100% - results we'd never achieved in five years of digital marketing.                        ",
    "name": "Zhang Wei",
    "designation": "Cloud Marketing Director",
    "company": "Huawei",
    "image": "https://randomuser.me/api/portraits/men/90.jpg",
  },
  {
    "testimonial": "When ministers demanded perfection for the provincial signing ceremony, Pan delivered flawlessly. His protocol standards are now our national benchmark for government events.                   ",
    "name": "Chen Ying",
    "designation": "Deputy Director",
    "company": "Shanxi Provincial Government",
    "image": "https://randomuser.me/api/portraits/women/85.jpg",
  },
];

const projects = [
  {
    name: "Porsche 911 Legend Exhibition",
    description: 
      "Flagship automotive launch event featuring immersive 'Time Tunnel' experience and MR technology, achieving 65-min attendee engagement (3x industry average) and 980M+ Weibo impressions through viral UGC campaigns.",
    tags: [
      {
        name: "​​Immersive​​",
        color: "blue-text-gradient",
      },
      {
        name: "Viral​​",
        color: "green-text-gradient",
      },
      {
        name: "​​Benchmark",
        color: "pink-text-gradient",
      },
    ],
    image: porsche1,
    source_code_link: "https://www.porsche.cn/china/zh/aboutporsche/pressreleases/?id=2019-10-118pool=china&lang=zh",
  },
  {
    name: "Huawei B2B Live-Stream Transformation",
    description: 
      "Integrated hybrid engagement solution combining technical livestreams with virtual factory modules, increasing viewer retention to 32 minutes and securing 100% client renewal for enterprise technology marketing.",
    tags: [
      {
        name: "Hybrid​​",
        color: "blue-text-gradient",
      },
      {
        name: "Retention-Focused​​",
        color: "green-text-gradient",
      },
      {
        name: "​​Renewal-Driven",
        color: "pink-text-gradient",
      },
    ],
    image: huawei1,
    source_code_link: "https://activity.huaweicloud.com/kuaichengzhang_live.html",
  },
  {
    name: "Tencent Global Digital Ecology Conference",
    description:
       "Large-scale innovation summit with cross-platform promotion strategy, generating 2.3B+ total exposure through media matrix integration and creative activation of Tencent's ecosystem products.",
    tags: [
      {
        name: "Ecosystem-Scale",
        color: "blue-text-gradient",
      },
      {
        name: "Cross-Platform",
        color: "green-text-gradient",
      },
      {
        name: "Exposure-Maximized​​",
        color: "pink-text-gradient",
      },
    ],
    image: tencent1,
    source_code_link: "https://des.cloud.tencent.com/",
  },
];

export { services, technologies, experiences, testimonials, projects };

