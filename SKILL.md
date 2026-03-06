---
name: lucky-deploy
description: 自动化前端项目创建和部署到 Vercel。使用场景：用户想用自然语言描述来快速创建前端项目并获取预览链接。触发词包括"做一个...","创建...","部署...","生成..."等，后面跟着项目描述。Skill 使用 OpenClaw 内置的代码生成能力，不需要额外的 AI API Key。
---

# Lucky Deploy - 自动化前端部署

根据用户自然语言描述，**使用 OpenClaw 内置能力**生成前端项目代码并部署到 Vercel，返回预览链接。

## 核心特点

- **内置生成**：使用 OpenClaw 自己的代码生成能力，无需外部 AI API Key
- **最佳实践**：生成的代码遵循现代前端最佳实践
- **自适应**：任何类型的前端项目都可以生成

## 前置要求

只需要：
- `VERCEL_TOKEN` - Vercel 部署令牌

## 使用方法

当用户说：
```
用户: 做一个待办事项应用，要有添加删除功能，深色主题
用户: 创建一个产品展示页面，有轮播图和价格表
用户: 做一个 Markdown 编辑器，可以实时预览
```

执行流程：
1. 使用 OpenClaw 能力根据描述生成完整的前端代码
2. 保存项目文件到 `projects/` 目录
3. 部署到 Vercel
4. 返回预览链接

## 代码生成指导原则

生成代码时遵循以下最佳实践：

### 技术栈
- **单文件优先**：尽可能使用单个 HTML 文件（内嵌 CSS 和 JS）
- **无需构建**：纯 HTML/CSS/JS，直接部署
- **现代 CSS**：使用 CSS Grid、Flexbox、CSS 变量
- **响应式**：移动端优先设计

### 代码质量
- **语义化 HTML**：使用正确的标签
- **可访问性**：ARIA 标签、键盘导航
- **性能**：优化图片、最小化重绘
- **交互**：平滑过渡、微交互

### 设计系统
- **配色**：根据描述自动选择配色方案
- **字体**：系统字体栈，确保加载速度
- **间距**：一致的 8px 基准网格
- **圆角**：统一的圆角规范

## 共享和分发

### 打包 Skill
```bash
# Skill 已打包为 lucky-deploy.skill 文件
# 这是一个 zip 格式的文件，可以直接分享
```

### 安装 Skill
```bash
# 方法 1: 复制到 OpenClaw skills 目录
cp lucky-deploy.skill ~/.openclaw/skills/

# 方法 2: 使用 OpenClaw CLI
openclaw skill install lucky-deploy.skill
```

### 分享给别人
1. 发送 `lucky-deploy.skill` 文件
2. 对方放置到他们的 `~/.openclaw/skills/` 目录
3. 重启 OpenClaw 或运行 `openclaw skill reload`

## 项目结构

```
lucky-deploy/
├── SKILL.md              # Skill 说明（本文件）
├── lucky-deploy.js       # 主入口（由 OpenClaw 调用）
├── scripts/
│   └── deploy.js         # Vercel 部署脚本
└── projects/             # 生成的项目存放目录
```
