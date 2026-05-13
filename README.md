# 🎨 黎杰朗 · Brand Designer Portfolio

品牌设计师作品集网站，基于 Next.js 16 + Tailwind CSS + Supabase。

## ✨ 功能

### 🖥️ 前端展示
- 🖱️ **炫酷 Hero Banner** — 鼠标移动粒子互动 + 渐变文字 + 全局光标光晕
- 🍎 **Apple 风格 UI** — 干净简洁，渐变标题，细腻微交互
- 🎭 **流畅动画** — 文字渐显、卡片悬停放大、技能标签上浮
- 📱 **完美响应式** — 手机/平板/桌面全适配
- 🖼️ **项目详情页** — 完整项目展示，支持视频嵌入
- 📬 **联系表单** — 前端表单 + API 路由
- 🔍 **SEO 优化** — Open Graph 标签，语义化 HTML

### 🔐 后台管理（/admin）
- 🔑 **密码登录** — 设置 `ADMIN_PASSWORD` 环境变量即可
- ✏️ **项目管理** — 新增/编辑/删除项目
- 📷 **图片上传** — 通过 Supabase Storage 上传，即时预览
- 🎨 **可视化编辑** — 标题、分类、描述、颜色、年份、排序
- 🚀 **一键部署** — 触发 Vercel Deploy Hook 重新部署

---

## 🚀 快速开始

### 1. 安装依赖
```bash
npm install
```

### 2. 设置管理后台密码（可选）
```bash
# 创建 .env.local
echo 'ADMIN_PASSWORD=your-secret-password' > .env.local
```

> 不设置密码则后台无需登录即可访问

### 3. 配置 Supabase（可选，用于在线 CMS）

#### 3a. 创建 Supabase 项目
1. 访问 [supabase.com](https://supabase.com) 注册/登录
2. 点击 "New project"，创建免费项目
3. 记下 **Project URL** 和 **anon public key**

#### 3b. 运行数据库 Schema
1. 进入 Supabase 项目的 **SQL Editor**
2. 复制粘贴 `src/lib/supabase/types.ts` 底部的 `SCHEMA_SQL`
3. 点击 Run

#### 3c. 创建 Storage Bucket
1. 进入 Supabase 项目的 **Storage**
2. 创建名为 `images` 的 bucket
3. 设置为 **Public**

#### 3d. 配置环境变量
```bash
# .env.local 添加：
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...
```

> 不配置 Supabase 也能使用，网站会使用 `src/lib/data.ts` 中的静态数据。

### 4. 本地预览
```bash
npm run dev
# 前台: http://localhost:3000
# 后台: http://localhost:3000/admin
```

### 5. 部署到 Vercel
```bash
npx vercel
```
环境变量在 Vercel Dashboard → Settings → Environment Variables 中设置。

---

## 📁 项目结构

```
portfolio/
├── src/
│   ├── app/
│   │   ├── globals.css           # 全局样式 + 动画
│   │   ├── layout.tsx            # 根布局（含光标光晕）
│   │   ├── page.tsx              # 首页
│   │   ├── admin/                # 🔐 后台管理
│   │   │   ├── login/            # 登录页
│   │   │   ├── projects/         # 项目管理
│   │   │   └── layout.tsx        # 后台布局（含侧边栏）
│   │   ├── projects/[id]/        # 🖼️ 项目详情页
│   │   └── api/                  # API 路由
│   │       ├── contact/          # 联系表单 API
│   │       └── admin/            # 后台 API（CRUD + 上传）
│   ├── components/
│   │   ├── CursorGlow.tsx        # 全局光标光晕
│   │   ├── HeroBanner.tsx        # 首屏互动 Banner
│   │   ├── HeroParticles.tsx     # Canvas 粒子系统
│   │   ├── Navigation.tsx        # 导航栏
│   │   ├── ProjectGrid.tsx       # 作品展示网格
│   │   ├── ExperienceSection.tsx  # 工作经历
│   │   ├── AboutSection.tsx      # 关于我
│   │   ├── ContactSection.tsx    # 联系方式（含表单）
│   │   └── Footer.tsx            # 页脚
│   └── lib/
│       ├── data.ts               # 📝 静态数据（无需 Supabase 时编辑这个）
│       ├── admin-auth.ts         # 后台认证逻辑
│       └── supabase/
│           ├── client.ts         # Supabase 客户端
│           ├── data.ts           # 数据读取层（Supabase + 静态回退）
│           └── types.ts          # 数据库类型 + Schema SQL
└── public/images/                # 放你的本地图片
```

---

## 🎨 自定义

### 改颜色
编辑 `src/app/globals.css` 的 `:root {}`：
```css
:root {
  --accent: #0071e3;     /* 改这行换主题色 */
  --gradient-start: #0071e3;  /* 渐变起始色 */
  --gradient-end: #8b5cf6;    /* 渐变结束色 */
}
```

### 改内容（本地模式）
编辑 `src/lib/data.ts`，所有内容集中在此文件。

### 改内容（Supabase 模式）
登录 `/admin` 后台直接编辑，数据实时生效。

### 用 v0.dev 调整设计
把组件代码粘贴到 [v0.dev](https://v0.dev)，用中文描述改动即可。

---

## 🔧 环境变量说明

| 变量 | 必填 | 说明 |
|------|------|------|
| `ADMIN_PASSWORD` | 推荐 | 后台登录密码，不设置则无需登录 |
| `NEXT_PUBLIC_SUPABASE_URL` | 可选 | Supabase 项目 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 可选 | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | 可选 | Supabase service role key |
| `VERCEL_DEPLOY_HOOK` | 可选 | Vercel Deploy Hook URL（用于后台一键部署） |
| `RESEND_API_KEY` | 可选 | Resend API key（用于联系表单邮件通知） |
| `CONTACT_EMAIL` | 可选 | 接收联系表单通知的邮箱 |

---

**Happy designing! 🎨**
