// A case photograph is rendered only when media.publicationStatus === 'approved'.
// No existing event image has been confirmed for its specific project yet.
export const projects = [
  {
    id: 'porsche-992', brand: 'Porsche', display: '992', dates: '2019.09 - 2019.11', employerId: 'fengkeda', media: null,
    en: {
      title: 'Porsche 992 launch project', category: 'Brand experience', role: 'Project Manager',
      summary: 'Coordinating budgets, design and on-site execution to bring the exhibition experience and delivery plan together.',
      intro: 'A new-car launch brings brand content, exhibition design, visitor experience and on-site delivery into one project. As project manager, I coordinated the budget, design and execution arrangements.',
      responsibilities: ['Coordinate the project budget, design proposals and execution work.', 'Help organise exhibition content around model history and the visitor experience.', 'Coordinate resources for interactive experiences and communications activities.'],
      sections: [
        { title: 'Turning a launch into an experience', text: 'The project combined a new-car launch with an exhibition experience. The task was to organise how the vehicle, its history and the interactive elements would be presented, while keeping design decisions connected to the practical arrangements for delivery.' },
        { title: 'Coordinating the different parts', text: 'The exhibition included a “time tunnel” around the model’s history and an MR experience using equipment provided by Porsche. My contribution concerned project coordination and execution. The equipment, technical development and the work of the wider creative team remain distinct from my individual role.' },
        { title: 'Connecting the site and the content', text: 'The project also included audience storytelling and livestream-related communications. These activities had to be coordinated alongside the exhibition, with resources organised across the different execution tasks.' },
        { title: 'Delivery', text: 'My work covered budget coordination, design coordination, exhibition arrangements and the execution of the associated experience and communication activities. Together, these form the project-management scope presented here.' },
      ],
    },
    zh: {
      title: '保时捷 992 新车发布项目', category: '品牌活动', role: '项目经理',
      summary: '协调预算、设计与现场执行，把展陈体验和交付流程组织在一起。',
      intro: '这项工作涉及新车发布与展陈体验，需要把品牌内容、参观动线、互动环节和现场执行组织在一起。我以项目经理的角色参与，工作覆盖预算、设计协调及执行安排。',
      responsibilities: ['协调项目预算、设计方案和执行工作。', '围绕车型历史与参观体验安排展陈内容。', '配合互动体验及传播环节落地，协调相关执行资源。'],
      sections: [
        { title: '把发布内容组织成参观体验', text: '新车发布与展陈需要共同考虑：车辆如何呈现，车型历史怎样被理解，互动环节放在哪里，以及这些安排如何在现场落地。项目管理的工作，是把设计、预算与执行放到一起讨论，让不同环节能够衔接，而不是分别推进后再临时拼接。' },
        { title: '协调展陈与互动环节', text: '项目包含围绕车型历史展开的“时光隧道”展区，以及使用保时捷提供设备的 MR 体验。我的职责侧重项目协调与执行安排，包括展陈内容和相关资源的配合。技术设备、研发工作及团队其他成员的创意工作，不作为我的个人独立成果。' },
        { title: '连接现场与传播安排', text: '与展陈并行的，还有观众故事征集和直播相关的传播环节。这些活动需要在项目中协调资源，让现场体验与内容组织能够配合。我的工作围绕执行条件和项目衔接展开，配合不同参与方把各自负责的内容落地。' },
        { title: '完成内容', text: '这一项目中，我负责的工作覆盖预算协调、设计协调、展陈安排，以及互动体验和相关传播活动的执行配合。这些具体工作共同构成这里呈现的项目管理范围，也体现了品牌活动从方案走向现场时，需要持续协调的不同环节。' },
      ],
    },
  },
  {
    id: 'huawei-b2b-live', brand: 'Huawei', display: 'B2B live', dates: null, employerId: 'vhall', media: null,
    en: {
      title: 'Huawei B2B livestream projects', category: 'Digital marketing', role: 'Livestream Project Manager',
      summary: 'Bringing technical content, livestream production and distribution across platforms into a shared delivery process.',
      intro: 'Enterprise technical livestreams involve content preparation, speakers, technical execution and distribution. My work at Vhall covered preparation, delivery and review, helping the participating teams work to a consistent process.',
      responsibilities: ['Coordinate technical-product livestreams and selected overseas connections.', 'Contribute to operating standards and distribution workflows across platforms.', 'Support technical-content presentation and post-project data reviews.'],
      sections: [
        { title: 'Prepare the content', text: 'The projects focused on technical products and enterprise audiences. Content preparation included coordination around product explanations and how they would be presented in the livestream. The technical expertise came from the participating product teams; my role was to help organise the delivery.' },
        { title: 'Align the execution', text: 'Livestream delivery involved speakers, technical teams and, for some sessions, overseas connections. My coordination work connected these participants with the execution arrangements, so the content and production processes could work together.' },
        { title: 'Make distribution repeatable', text: 'The work included contributing to a cross-platform livestream operating guide and execution standards. Preparing content, arranging execution, distributing the stream and reviewing the results formed the working sequence, with documentation supporting consistency between projects.' },
        { title: 'Review and retain the learning', text: 'I supported project-data reviews alongside the live delivery work. The outputs presented here are the preparation and execution coordination, contributions to operating documentation, and review work associated with these enterprise livestream projects.' },
      ],
    },
    zh: {
      title: '华为 B端直播项目', category: '数字营销', role: '直播全案项目经理',
      summary: '围绕技术内容、直播流程和多平台分发，协调项目的准备与交付。',
      intro: '企业技术直播需要协调内容准备、嘉宾、技术执行和多平台分发。我在微吼直播任职期间，围绕这些项目的准备、实施和复盘开展工作，使不同参与方能够按一致的流程配合。',
      responsibilities: ['协调技术产品直播及部分海外连线的执行安排。', '参与多平台分发流程与执行标准整理。', '配合技术内容呈现和项目数据复盘。'],
      sections: [
        { title: '准备内容', text: '技术产品直播面向企业受众，内容准备需要兼顾产品信息与直播呈现。项目中包含产品解读等内容环节，需要配合产品团队组织相关信息。产品技术本身由相应团队提供；我的职责是围绕内容呈现和交付安排做好协调，使内容准备与执行流程相互配合。' },
        { title: '安排执行', text: '从嘉宾到技术团队，不同参与方承担不同职责；部分直播还涉及海外连线。项目执行需要把这些安排放在同一套工作流程中，协调内容准备、技术执行与参与人员，让不同环节的工作能够接上。我的工作重点在准备、实施和各方协作。' },
        { title: '整理分发流程', text: '项目涉及多平台分发，我参与了跨平台直播操作手册和执行标准的整理。将准备内容、安排执行、完成分发与整理复盘串起来，有助于让不同项目沿用清楚的工作顺序。手册与标准属于协作交付的一部分，也是后续项目可以继续使用的经验。' },
        { title: '完成复盘', text: '直播结束后，我配合项目数据复盘，把执行过程与内容呈现放回项目目标中看。这里呈现的交付范围，包括准备与执行协调、操作文档整理，以及项目复盘。它们共同构成企业直播从单次活动到持续协作所需要的基础工作。' },
      ],
    },
  },
  {
    id: 'tencent-ecosystem', brand: 'Tencent', display: 'Ecosystem', dates: '2019.05 - 2019.06', employerId: 'cyts-linkage', media: null,
    en: {
      title: 'Tencent Digital Ecosystem Summit project', category: 'Conference & exhibition', role: 'Project Manager',
      summary: 'Organising product displays, interactive experiences and communications around a technology conference.',
      intro: 'This project concerned product presentations and experiences within the conference. My role was to coordinate how the product teams’ technical capabilities were presented on site, alongside related activities and communications.',
      responsibilities: ['Participate in product displays, interactive experiences and event execution.', 'Coordinate technical capabilities supplied by the product teams with their on-site presentation.', 'Support the organisation of media and short-form video content.'],
      sections: [
        { title: 'Presenting the product', text: 'The brief concerned making the value of products such as MyApp and Tencent Miying understandable in a conference setting. The project brought product displays, visitor interaction and related activities together. My responsibilities sat within project coordination and execution.' },
        { title: 'Coordinating the experience', text: 'The project included an AI medical-imaging interaction using technology provided by Tencent, as well as a developer-focused technical salon. These elements required coordination between product capabilities, the presentation and the activity arrangements. My contribution was not independent development of the underlying technology.' },
        { title: 'Supporting communications', text: 'Media activity and short-form video were part of the wider project. I supported their organisation and coordination alongside the on-site work, connecting the display and activity arrangements with the content needed for communications.' },
        { title: 'Delivery', text: 'The work presented here covers participation in displays and interactive activities, coordination with technical teams, and support for media and video content. These are the specific contributions that define my role in the conference project.' },
      ],
    },
    zh: {
      title: '腾讯全球数字生态大会项目', category: '会展与产品体验', role: '项目经理',
      summary: '围绕产品展示、体验环节和传播协作，组织项目执行。',
      intro: '这项工作围绕大会中的产品展示与体验展开，需要把技术价值转化成参会者能够理解的现场内容。我以项目经理的角色参与，协调展示、活动与传播环节，配合产品方提供的技术能力完成现场呈现。',
      responsibilities: ['参与产品展示、互动体验及相关活动执行。', '协调产品方提供的技术能力与现场呈现。', '配合媒体及短视频内容的组织与传播工作。'],
      sections: [
        { title: '理解产品展示的任务', text: '项目围绕应用宝、觅影等产品在大会中的呈现展开。技术产品进入会展场景后，需要同时考虑内容说明、互动体验和相关活动的组织。我的工作位于项目协调与执行环节，配合不同参与方把产品内容转化成可落地的现场安排。' },
        { title: '协调互动与活动安排', text: '项目包含使用腾讯提供技术的 AI 医疗影像互动装置，以及面向开发者的技术沙龙。这些环节连接了产品能力、展示方式与活动组织，需要在执行中协调彼此的配合。我的贡献是项目协调及执行，不将产品方的技术或研发工作写成个人独立开发成果。' },
        { title: '配合内容与传播', text: '现场活动之外，项目还涉及媒体与短视频内容的组织。相关传播工作与产品展示、活动执行并行，需要围绕大会内容做好协作。我参与其中的组织与配合，把不同环节需要的内容和执行安排连接起来。' },
        { title: '完成内容', text: '本案例呈现的工作范围，包括产品展示和互动活动的执行参与、与技术团队的协调，以及媒体和短视频内容的配合。这些工作共同构成我在大会项目中的具体角色，也说明了技术内容、现场体验和传播工作之间需要怎样衔接。' },
      ],
    },
  },
];

export const approvedMedia = (project) => project.media?.publicationStatus === 'approved' ? project.media : null;
