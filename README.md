# Lucky Deploy

基于 OpenClaw 的前端项目生成与 Vercel 部署 Skill。**无需额外 AI API Key**，使用 OpenClaw 内置代码生成能力。

## 功能

- 🚀 自然语言描述 → 生成前端项目
- 🎨 使用 OpenClaw 内置 AI 生成代码（无需配置 API Key）
- 📤 自动部署到 Vercel
- 🔗 返回即时预览链接

## 安装

### 方式 1: 源码安装

```bash
git clone https://github.com/lcy19/lucky-deploy.git
cp -r lucky-deploy ~/.openclaw/skills/
```

### 方式 2: 手动安装 .skill 包

```bash
# 下载 Release 中的 lucky-deploy.skill
unzip lucky-deploy.skill -d ~/.openclaw/skills/
```

## 使用方法

安装后，对 OpenClaw 说：

```
做一个待办事项应用，深色主题
创建一个产品展示页面，有轮播图
做一个 Markdown 编辑器，实时预览
```

## 前置要求

仅需配置 Vercel 部署令牌：

```bash
export VERCEL_TOKEN="your_vercel_token"
```

在 [Vercel Dashboard](https://vercel.com/account/tokens) 创建 Token。

## 项目结构

```
lucky-deploy/
├── SKILL.md              # Skill 说明
├── lucky-deploy.js       # 主入口
├── scripts/
│   ├── deploy.js         # Vercel 部署
│   └── generate-project.js  # 模板生成（备用）
└── projects/             # 生成的项目（本地，不提交）
```

## 开发与发布

```bash
# 打包
./update-skill.sh

# 发布到 ClawHub
npx clawhub publish .
```

## 许可证

MIT
