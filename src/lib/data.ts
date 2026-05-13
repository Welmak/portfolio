// ============================================================
// 🎨 黎杰朗 · 品牌设计师 作品集
// 修改这个文件即可更新网站内容
// 所有中文描述可根据需要增删改
// ============================================================

export const siteConfig = {
  title: '黎杰朗 Jielang Li — Brand Designer',
  description: '品牌设计师 · 跨境视觉专家 · Brand Designer & Visual Creative',
  name: 'Allen Lee',
  nameCN: '黎杰朗',
  role: 'Brand Designer',
  tagline: 'Building brands that stand out. 用设计让品牌脱颖而出。',
  email: 'allenperiod2@gmail.com',
  phone: '135-4692-3685',
  location: '深圳 · 南山',
  social: {
    behance: '',
    dribbble: '',
    instagram: '',
    linkedin: '',
  },
}

export const aboutData = {
  subtitle: 'About Me',
  title: '品牌设计师 ·\n跨境视觉专家',
  paragraphs: [
    '我是一名专注于品牌全链路设计的设计师，拥有 4 年以上跨境品牌视觉设计经验。擅长从品牌策略到视觉落地的全流程把控，曾为多家医疗、户外品牌打造从 0 到 1 的设计体系。',
    '持有 Adobe Certified Professional（ACP）认证，精通 Photoshop、Illustrator、Keyshot、Midjourney 等工具，能将创意高效转化为高品质设计成果。曾参加为期半年的国际品牌设计大师课程，深度钻研全球顶尖品牌设计趋势。',
    '始终以数据和用户反馈驱动设计优化——广告图片点击率平均提升 20%+，产品上市周期缩短 17%，品牌粉丝增长 2 万+。坚信好设计不仅好看，更能创造商业价值。',
    '科曼医疗曾评价："与这位设计师合作，其对品牌核心的精准把握，使我们的品牌形象在市场中焕然一新。"',
  ],
  education: {
    school: '东莞理工学院',
    degree: '全日制本科',
  },
  skills: [
    'Adobe Photoshop',
    'Adobe Illustrator',
    'Keyshot 渲染',
    'Midjourney AI',
    'Premiere 剪辑',
    'Brand Identity',
    '视觉全案设计',
    '亚马逊 A+ 设计',
    'Shopify 独立站',
    '包装设计',
    '产品精修',
    '社媒视觉',
  ],
}

export const experienceData = {
  subtitle: 'Experience',
  title: 'Work Experience',
  jobs: [
    {
      role: '品牌设计师',
      company: '深圳锐掣创新科技有限公司（跨境户外）',
      period: '2023/08 — 至今',
      highlights: [
        '负责公司整体的品牌全局框架设计',
        '亚马逊旗舰店（户外加热服、床垫、帐篷）整体风格定制设计',
        'Shopify 独立站的整体风格把控及活动页制作',
        '社媒平台的品宣活动页整体品牌视觉把控与输出',
        '线下物料制作：包装、标签、说明书、明信片等',
      ],
    },
    {
      role: '视觉设计师',
      company: '深圳爱非科医疗科技有限公司（跨境医疗）',
      period: '2021/04 — 2023/08',
      highlights: [
        '负责海外官网和国际站的装修设计（TO B）',
        '公司视觉文化定制：产品包装、礼物包装等品牌形象制作',
        '产品精修拍摄和视频文化制作',
        '对接国外线下视觉设计（公司海外子公司）',
      ],
    },
  ],
}

export const projects: Project[] = [
  {
    id: 'medical-brand',
    title: '医疗品牌全链路孵化与设计体系搭建',
    category: 'Brand Identity',
    year: '2023-2025',
    brand: '爱非科 · 科曼医疗',
    description:
      '提供一站式医疗品牌孵化与系统性设计体系搭建服务。从品牌全局规范设计，到产品 0→1 全链路视觉，再到广告转化率提升。助力 10+ 个一站式医疗方案明确独特视觉风格，产品上市周期平均缩短 17%，广告图片测试转化率平均提升 20%。',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80',
    link: '#',
    color: '#06b6d4',
    challenge: '医疗行业品牌形象同质化严重，缺乏系统化的视觉语言体系，多个子品牌视觉割裂，难以建立统一品牌认知。',
    solution: '从品牌策略出发，建立完整的设计规范体系——色彩系统、字体层级、图形语言、影像风格，统一 10+ 子品牌视觉表达，构建可复用的设计组件库。',
    result: '品牌辨识度显著提升，海外官网流量增长 50%，客户询盘率提高 35%，品牌一致性评分从 3.2 提升至 8.7。',
    keyMetric: '品牌一致性 ↗ 172%',
  },
  {
    id: 'commouds',
    title: 'Commouds 充气床垫品牌',
    category: 'Amazon Brand Design',
    year: '2024',
    brand: 'Commouds',
    description:
      '主图优化点击率提升 20%；A+ 套图包含细节特写和使用场景，用户平均停留时间增加 12 秒；Instagram、Pinterest 等平台发布 20 张产品 Post 图，粉丝互动率提升 30%。',
    image: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=800&q=80',
    link: '#',
    color: '#8b5cf6',
    challenge: '新品上架初期 Listing 转化率低，主图无法有效传达产品核心卖点，A+ 内容缺失导致用户决策信息不足。',
    solution: '重新规划 Listing 视觉策略——主图突出核心场景痛点，A+ 模块化展示产品细节、技术参数和生活方式，社媒同步发布品牌 Post 强化用户心智。',
    result: '主图点击率提升 20%，A+ 页面平均停留时间增加 12 秒，社媒互动率提升 30%，整体 Listing 评分从 3.8 升至 4.5。',
    keyMetric: '点击率 ↗ 20%',
  },
  {
    id: 'venustas',
    title: 'Venustas 加热羽绒服品牌',
    category: 'E-commerce Design',
    year: '2024',
    brand: 'Venustas',
    description:
      '以雪山木屋为核心视觉重新定调品牌展示，点击率提升 25%；A+ 内容涵盖保暖原理、材质介绍、穿搭示范，用户停留时间增加 12 秒，转化率提高 8%；社媒运营 Facebook、TikTok 等发布 30 张时尚穿搭 Post 图，品牌粉丝增长 2 万。',
    image: 'https://images.unsplash.com/photo-1544928147-79a2dbc22abe?w=800&q=80',
    link: '#',
    color: '#f97316',
    challenge: '户外羽绒服市场竞品视觉雷同，品牌缺乏记忆点，用户无法在浏览中快速识别品牌差异化价值。',
    solution: '打造「雪山木屋」核心视觉符号，建立独特品牌记忆锚点。统一社媒、Listing、独立站视觉语言，用场景化穿搭内容传递产品温度。',
    result: '点击率提升 25%，转化率提高 8%，品牌粉丝增长 2 万+，多平台品牌搜索量增长 60%。',
    keyMetric: '品牌粉丝 ↗ 20K',
  },
  {
    id: 'outdoor-brands',
    title: '户外产品外贸四大品牌搭建',
    category: 'Multi-Brand System',
    year: '2023-2025',
    brand: 'Venustas · Commouds · TP · Gorich',
    description:
      '统筹户外加热服（Venustas）、充气床垫（Commouds）、加绒连衣裙（TP）、帐篷（Gorich）四品牌全局视觉体系，涵盖亚马逊旗舰店 + Shopify 独立站 + 社媒全链路品牌设计。',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    link: '#',
    color: '#84cc16',
    challenge: '同一公司旗下四个品牌定位各异，但缺乏清晰的视觉区隔，导致品牌间相互混淆，消费者难以区分。',
    solution: '为每个品牌建立独立视觉人格——不同色彩体系、影像风格和设计语言，同时在品牌架构层面保持统一的设计质量标准和视觉 DNA。',
    result: '四品牌各自形成独立视觉识别，亚马逊旗舰店整体风格统一度达到 90%+，客户品牌混淆率下降 45%。',
    keyMetric: '品牌混淆率 ↘ 45%',
  },
  {
    id: 'aifeike',
    title: '爱非科医疗品牌体系搭建',
    category: 'Corporate Branding',
    year: '2021-2023',
    brand: '爱非科医疗',
    description:
      '从 0→1 建立医疗公司品牌设计网络体系：公司文化可视化输出、文化三折页、媒体海报、节假日物料；产出 10+ 套产品手册、包装物料、精修图、Banner 宣传图；搭建独立 RDT 及家用医疗从 0→1 平台，完成阿里国际站设计搭建，平台上线初期流量增长 50%。',
    image: 'https://images.unsplash.com/photo-1582719471384-894fbb4cb074?w=800&q=80',
    link: '#',
    color: '#6366f1',
    challenge: '初创医疗公司从零开始，缺乏品牌基础，需要在短时间内建立专业可信的品牌形象以支撑海外市场拓展。',
    solution: '从品牌策略入手，搭建完整的视觉资产体系——Logo 系统、品牌色、产品包装、官网设计、社媒模板、线下物料，形成可复制的品牌输出流程。',
    result: '3 个月内完成品牌体系 0→1 搭建，阿里国际站上线初期流量增长 50%，海外客户信任度显著提升，支撑 10+ 产品线顺利出海。',
    keyMetric: '流量增长 ↗ 50%',
  },
  {
    id: 'social-media',
    title: '跨境社媒品牌视觉运营',
    category: 'Social Media Design',
    year: '2023-2025',
    brand: 'Venustas · Commouds',
    description:
      '在 Instagram、Pinterest、Facebook、TikTok 等平台产出 50+ 产品 Post 图，搭配品牌文案与话题讨论，持续提升品牌声量和用户粘性，多品牌粉丝互动率平均提升 30%+。',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80',
    link: '#',
    color: '#ec4899',
    challenge: '社媒平台内容杂乱，缺乏统一的品牌视觉调性，各平台用户互动率低，品牌内容无法形成有效传播。',
    solution: '建立社媒视觉规范——统一排版风格、品牌色应用、图片调性，针对不同平台特性定制内容策略，打造系列化品牌内容矩阵。',
    result: '产出 50+ 高质量 Post 图，多品牌粉丝互动率平均提升 30%+，品牌内容触达量增长 2.5 倍，社媒粉丝总量增长 3 万+。',
    keyMetric: '互动率 ↗ 30%',
  },
]

import type { ContentItem } from '@/lib/content-blocks'

export interface Project {
  id: string
  title: string
  category: string
  year: string
  description: string
  image: string
  videoUrl?: string
  content?: ContentItem[]
  link: string
  color: string
  brand?: string
  challenge?: string
  solution?: string
  result?: string
  keyMetric?: string
}
