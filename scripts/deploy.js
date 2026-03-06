#!/usr/bin/env node

/**
 * 部署项目到 Vercel
 * 用法: node deploy.js "项目目录"
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const projectDir = process.argv[2];

if (!projectDir) {
    console.error('用法: node deploy.js "项目目录"');
    process.exit(1);
}

const VERCEL_TOKEN = process.env.VERCEL_TOKEN;

if (!VERCEL_TOKEN) {
    console.error('❌ 错误: VERCEL_TOKEN 环境变量未设置');
    process.exit(1);
}

console.log('[部署] 开始部署到 Vercel...');

try {
    const output = execSync(
        `cd "${projectDir}" && vercel --token "${VERCEL_TOKEN}" --yes`,
        { encoding: 'utf-8', stdio: 'pipe' }
    );
    
    // 提取 URL
    const urlMatch = output.match(/https:\/\/[a-zA-Z0-9-]+\.vercel\.app/);
    const deployUrl = urlMatch ? urlMatch[0] : null;
    
    if (deployUrl) {
        console.log('[部署] 成功');
        console.log(`URL: ${deployUrl}`);
        
        // 保存记录
        const record = {
            time: new Date().toISOString(),
            url: deployUrl,
            projectDir
        };
        
        const historyFile = path.join(__dirname, '..', 'deploy-history.json');
        let history = [];
        if (fs.existsSync(historyFile)) {
            history = JSON.parse(fs.readFileSync(historyFile, 'utf-8'));
        }
        history.unshift(record);
        fs.writeFileSync(historyFile, JSON.stringify(history, null, 2));
        
        // 输出结果供父进程捕获
        console.log(JSON.stringify({ success: true, url: deployUrl }));
    } else {
        console.log('[部署] 完成，但未获取到 URL');
        console.log(output);
    }
} catch (error) {
    console.error('[部署] 失败:', error.message);
    process.exit(1);
}
