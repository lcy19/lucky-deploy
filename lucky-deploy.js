#!/usr/bin/env node

/**
 * Lucky Deploy - 自动化前端部署
 * 
 * 这个脚本由 OpenClaw 调用，但实际的代码生成由 OpenClaw 内置能力完成
 * 用法: node lucky-deploy.js "项目描述"
 * 
 * 注意：此脚本本身不直接生成代码，而是依赖 OpenClaw 的代码生成能力
 * 代码生成后通过环境变量或文件传递到此脚本进行部署
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const description = process.argv[2];
const generatedCode = process.argv[3]; // OpenClaw 生成的代码

if (!description) {
    console.error('用法: node lucky-deploy.js "项目描述" ["生成的代码"]');
    process.exit(1);
}

// 检查环境变量
const VERCEL_TOKEN = process.env.VERCEL_TOKEN;

if (!VERCEL_TOKEN) {
    console.error('❌ 错误: VERCEL_TOKEN 环境变量未设置');
    console.error('请设置: export VERCEL_TOKEN="你的token"');
    process.exit(1);
}

const scriptDir = __dirname;
const projectsDir = path.join(scriptDir, 'projects');
const timestamp = Date.now();
const projectName = `lucky${timestamp}`;
const projectDir = path.join(projectsDir, projectName);

// 创建项目目录
fs.mkdirSync(projectDir, { recursive: true });

// 如果有传入生成的代码，直接写入
if (generatedCode) {
    fs.writeFileSync(path.join(projectDir, 'index.html'), generatedCode);
    
    // 创建 package.json
    const pkg = {
        name: projectName,
        version: '1.0.0',
        description: description,
        scripts: { dev: 'npx serve .' }
    };
    fs.writeFileSync(path.join(projectDir, 'package.json'), JSON.stringify(pkg, null, 2));
    
    console.log('[Lucky Deploy] 项目文件已创建');
} else {
    console.log('[Lucky Deploy] 等待代码生成...');
    console.log('[Lucky Deploy] 提示: 此脚本需要 OpenClaw 生成代码后调用');
    process.exit(1);
}

// 部署
try {
    console.log('[Lucky Deploy] 正在部署到 Vercel...');
    const output = execSync(`node "${path.join(scriptDir, 'scripts', 'deploy.js')}" "${projectDir}"`, {
        encoding: 'utf-8',
        env: { ...process.env, VERCEL_TOKEN }
    });
    
    // 解析 JSON 输出
    const lines = output.trim().split('\n');
    const lastLine = lines[lines.length - 1];
    
    try {
        const result = JSON.parse(lastLine);
        if (result.success) {
            console.log(JSON.stringify({
                success: true,
                url: result.url,
                projectDir: projectDir,
                message: '部署成功'
            }));
        }
    } catch (e) {
        console.log(output);
    }
} catch (e) {
    console.error('❌ 部署失败:', e.message);
    process.exit(1);
}
