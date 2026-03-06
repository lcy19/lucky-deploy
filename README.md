# Lucky Deploy

自动化前端项目创建和部署到 Vercel 的 OpenClaw Skill。

## 功能

- 🚀 根据自然语言描述生成前端项目
- 🎨 使用 OpenClaw 内置能力动态生成代码
- 📤 自动部署到 Vercel
- 🔗 返回即时预览链接

## 安装

### 方式 1: 通过 ClawHub 安装（推荐）

```bash
npx clawhub install lucky-deploy
```

### 方式 2: 手动安装

```bash
# 下载 .skill 文件
# 解压到 OpenClaw skills 目录
unzip lucky-deploy.skill -d ~/.openclaw/skills/
```

### 方式 3: 源码安装

```bash
# 克隆仓库
git clone https://github.com/yourusername/lucky-deploy.git

# 复制到 OpenClaw skills 目录
cp -r lucky-deploy ~/.openclaw/skills/
```

## 使用方法

安装后，直接对 OpenClaw 说：

```
做一个待办事项应用，深色主题
创建一个产品展示页面，有轮播图
做一个 Markdown 编辑器
```

## 前置要求

- `VERCEL_TOKEN` - Vercel 部署令牌

设置方法：
```bash
export VERCEL_TOKEN="your_vercel_token"
```

## 项目结构

```
lucky-deploy/
├── SKILL.md              # Skill 说明
├── lucky-deploy.js       # 主入口
├── scripts/
│   └── deploy.js         # Vercel 部署脚本
└── projects/             # 生成的项目存放目录
```

## 开发

### 本地修改

1. 修改 `SKILL.md` 或脚本文件
2. 运行更新脚本：
   ```bash
   ./update-skill.sh "修改说明"
   ```
3. 测试新包

### 发布到 ClawHub

```bash
npx clawhub publish .
```

## 许可证

MIT
