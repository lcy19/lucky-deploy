#!/usr/bin/env node

/**
 * AI 动态生成前端项目
 * 用法: node ai-generate.js "描述" "输出目录"
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const description = process.argv[2];
const outputDir = process.argv[3];

if (!description || !outputDir) {
    console.error('用法: node ai-generate.js "描述" "输出目录"');
    process.exit(1);
}

// API 配置 - 优先使用 Moonshot (Kimi)
const API_KEY = process.env.MOONSHOT_API_KEY || process.env.OPENAI_API_KEY;
const API_URL = process.env.MOONSHOT_API_KEY 
    ? 'https://api.moonshot.cn/v1/chat/completions'
    : 'https://api.openai.com/v1/chat/completions';
const MODEL = process.env.MOONSHOT_API_KEY ? 'moonshot-v1-8k' : 'gpt-4o-mini';

if (!API_KEY) {
    console.error('❌ 错误: 需要设置 MOONSHOT_API_KEY 或 OPENAI_API_KEY 环境变量');
    process.exit(1);
}

console.log('[AI生成] 正在调用模型生成代码...');
console.log(`[AI生成] 使用模型: ${MODEL}`);

const prompt = `你是一个专业的前端开发专家。请根据用户的描述，生成一个完整的前端项目。

## 用户描述
"${description}"

## 生成要求

1. **单文件 HTML**：生成一个完整的 HTML 文件，包含内嵌的 CSS 和 JavaScript
2. **现代设计**：使用现代化的 UI 设计，包括：
   - 流畅的动画和过渡效果
   - 合理的配色方案（根据描述自动判断深色/浅色主题）
   - 响应式布局，适配手机和桌面
3. **完整功能**：实现用户描述的所有功能需求
4. **代码质量**：
   - 语义化的 HTML 标签
   - CSS 使用现代特性（Grid、Flexbox、变量）
   - JavaScript 使用现代语法（ES6+）
   - 添加适当的注释

## 输出格式

请直接输出完整的 HTML 代码，格式如下：

｜｜｜html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>页面标题</title>
    <style>
        /* CSS 代码 */
    </style>
</head>
<body>
    <!-- HTML 内容 -->
    <script>
        // JavaScript 代码
    </script>
</body>
</html>
｜｜｜

请确保代码可以直接运行，不需要额外的依赖或构建步骤。`;

// 调用 API
const requestData = JSON.stringify({
    model: MODEL,
    messages: [
        { role: 'system', content: '你是一个专业的前端开发专家，擅长生成现代化、美观、功能完整的前端代码。' },
        { role: 'user', content: prompt }
    ],
    temperature: 0.7
});

const options = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
    }
};

const req = https.request(API_URL, options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        try {
            const response = JSON.parse(data);
            
            if (response.error) {
                console.error('[AI生成] API 错误:', response.error.message);
                process.exit(1);
            }
            
            const content = response.choices[0].message.content;
            
            // 提取 HTML 代码
            const htmlMatch = content.match(/｜｜｜html\n([\s\S]*?)\n｜｜｜/) || 
                              content.match(/```html\n([\s\S]*?)\n```/) ||
                              content.match(/<!DOCTYPE html>[\s\S]*<\/html>/);
            
            let htmlCode;
            if (htmlMatch) {
                htmlCode = htmlMatch[1] || htmlMatch[0];
            } else {
                // 如果没有代码块，尝试直接使用内容
                htmlCode = content;
            }
            
            // 确保是完整的 HTML
            if (!htmlCode.includes('<!DOCTYPE html>')) {
                htmlCode = `<!DOCTYPE html>\n${htmlCode}`;
            }
            
            // 创建输出目录
            fs.mkdirSync(outputDir, { recursive: true });
            
            // 写入文件
            fs.writeFileSync(path.join(outputDir, 'index.html'), htmlCode);
            
            // 创建 package.json（Vercel 需要）
            const pkg = {
                name: path.basename(outputDir),
                version: '1.0.0',
                description: description,
                scripts: { dev: 'npx serve .' }
            };
            fs.writeFileSync(path.join(outputDir, 'package.json'), JSON.stringify(pkg, null, 2));
            
            console.log('[AI生成] 代码生成完成');
            console.log(`[AI生成] 文件位置: ${path.join(outputDir, 'index.html')}`);
            
        } catch (e) {
            console.error('[AI生成] 解析错误:', e.message);
            console.error('原始响应:', data.slice(0, 500));
            process.exit(1);
        }
    });
});

req.on('error', (e) => {
    console.error('[AI生成] 请求错误:', e.message);
    process.exit(1);
});

req.write(requestData);
req.end();
