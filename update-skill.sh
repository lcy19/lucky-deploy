#!/bin/bash

# Lucky Deploy Skill 更新脚本
# 用法: ./update-skill.sh [版本说明]

set -e

SKILL_DIR="/Users/flutter/.openclaw/workspace/lucky-deploy"
WORKSPACE="/Users/flutter/.openclaw/workspace"
VERSION_MSG="${1:-更新 Skill}"

echo "🔄 更新 Lucky Deploy Skill..."
echo ""

# 1. 进入 Skill 目录
cd "$SKILL_DIR"

# 2. 更新版本记录
echo "[1/4] 更新版本记录..."
date "+%Y-%m-%d %H:%M:%S" >> "$SKILL_DIR/VERSION"
echo "  $VERSION_MSG" >> "$SKILL_DIR/VERSION"

# 3. 重新打包
echo "[2/4] 重新打包 Skill..."
python3 /Users/flutter/.nvm/versions/node/v25.6.1/lib/node_modules/openclaw/skills/skill-creator/scripts/package_skill.py "$SKILL_DIR" "$WORKSPACE"

echo ""
echo "✅ Skill 更新完成！"
echo ""
echo "📦 新包位置: $WORKSPACE/lucky-deploy.skill"
echo ""
echo "下一步:"
echo "  1. 本地测试: 复制到 ~/.openclaw/skills/"
echo "  2. 发布到 ClawHub: npx clawhub publish $SKILL_DIR"
echo "  3. GitHub 分享: 推送代码到仓库"
