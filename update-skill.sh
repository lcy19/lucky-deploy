#!/bin/bash

# Lucky Deploy Skill 打包脚本
# 用法: ./update-skill.sh
# 输出: 上级目录下的 lucky-deploy.skill

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
OUTPUT_DIR="${OUTPUT_DIR:-$(dirname "$SCRIPT_DIR")}"

echo "🔄 打包 Lucky Deploy Skill..."
cd "$SCRIPT_DIR"

zip -r "$OUTPUT_DIR/lucky-deploy.skill" . \
    -x "*.git*" \
    -x "node_modules/*" \
    -x "projects/*" \
    -x "*.skill" \
    -x ".DS_Store" \
    -x "deploy-history.json" \
    -x "VERSION" \
    -x ".env*"

[ -f "$OUTPUT_DIR/lucky-deploy.skill" ] || { echo "❌ 打包失败"; exit 1; }

echo ""
echo "✅ 打包完成: $OUTPUT_DIR/lucky-deploy.skill"
echo ""
echo "下一步:"
echo "  安装: unzip lucky-deploy.skill -d ~/.openclaw/skills/"
echo "  发布: npx clawhub publish ."
echo "  推送: git push origin main"
