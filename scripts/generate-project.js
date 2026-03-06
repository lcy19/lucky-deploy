#!/usr/bin/env node

/**
 * 生成前端项目
 * 用法: node generate-project.js "描述" "输出目录"
 */

const fs = require('fs');
const path = require('path');

const description = process.argv[2];
const outputDir = process.argv[3];

if (!description || !outputDir) {
    console.error('用法: node generate-project.js "描述" "输出目录"');
    process.exit(1);
}

// 检测项目类型
const isTodo = /待办|todo|task/i.test(description);
const isBlog = /博客|blog/i.test(description);
const isDark = /深色|dark|黑夜/i.test(description);

const projectType = isTodo ? 'todo' : isBlog ? 'blog' : 'landing';
const theme = isDark ? 'dark' : 'light';

console.log(`[生成器] 类型: ${projectType}, 主题: ${theme}`);

// 确保输出目录存在
fs.mkdirSync(outputDir, { recursive: true });

// 生成 HTML
const html = generateHTML(description, projectType, theme);
fs.writeFileSync(path.join(outputDir, 'index.html'), html);

// 生成 package.json
const pkg = {
    name: path.basename(outputDir),
    version: '1.0.0',
    description: description,
    scripts: { dev: 'npx serve .' }
};
fs.writeFileSync(path.join(outputDir, 'package.json'), JSON.stringify(pkg, null, 2));

console.log('[生成器] 项目生成完成');

function generateHTML(description, type, theme) {
    const colors = theme === 'dark' 
        ? { bg: '#0f0f23', text: '#e0e0e0', card: 'rgba(255,255,255,0.05)', accent: '#6366f1' }
        : { bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', text: '#fff', card: 'rgba(255,255,255,0.1)', accent: '#667eea' };

    if (type === 'todo') {
        return generateTodoHTML(description, colors);
    } else if (type === 'blog') {
        return generateBlogHTML(description, colors);
    } else {
        return generateLandingHTML(description, colors);
    }
}

function generateTodoHTML(description, colors) {
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${description}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            min-height: 100vh;
            background: ${colors.bg};
            color: ${colors.text};
            padding: 40px 20px;
        }
        .container { max-width: 500px; margin: 0 auto; }
        h1 { text-align: center; margin-bottom: 30px; }
        .input-group { display: flex; gap: 10px; margin-bottom: 20px; }
        input[type="text"] {
            flex: 1; padding: 15px; border: none; border-radius: 10px;
            background: ${colors.card}; color: ${colors.text}; font-size: 1rem;
        }
        input::placeholder { opacity: 0.5; }
        button {
            padding: 15px 25px; border: none; border-radius: 10px;
            background: ${colors.accent}; color: white; font-size: 1rem; cursor: pointer;
        }
        button:hover { opacity: 0.9; }
        .todo-list { list-style: none; }
        .todo-item {
            display: flex; align-items: center; gap: 10px; padding: 15px;
            margin-bottom: 10px; background: ${colors.card}; border-radius: 10px;
        }
        .todo-item.completed span { text-decoration: line-through; opacity: 0.5; }
        .todo-item span { flex: 1; }
        .delete { background: #e74c3c; padding: 8px 15px; font-size: 0.85rem; }
        .empty { text-align: center; opacity: 0.5; padding: 40px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>✅ ${description}</h1>
        <div class="input-group">
            <input type="text" id="input" placeholder="添加新任务...">
            <button onclick="add()">添加</button>
        </div>
        <ul class="todo-list" id="list"></ul>
        <div class="empty" id="empty">暂无任务</div>
    </div>
    <script>
        let todos = JSON.parse(localStorage.getItem('todos') || '[]');
        function render() {
            const list = document.getElementById('list');
            const empty = document.getElementById('empty');
            list.innerHTML = '';
            if (todos.length === 0) { empty.style.display = 'block'; }
            else {
                empty.style.display = 'none';
                todos.forEach((t, i) => {
                    const li = document.createElement('li');
                    li.className = 'todo-item' + (t.done ? ' completed' : '');
                    li.innerHTML = \`<input type="checkbox" \${t.done ? 'checked' : ''} onchange="toggle(\${i})"><span>\${t.text}</span><button class="delete" onclick="del(\${i})">删除</button>\`;
                    list.appendChild(li);
                });
            }
            localStorage.setItem('todos', JSON.stringify(todos));
        }
        function add() {
            const input = document.getElementById('input');
            if (input.value.trim()) { todos.push({ text: input.value.trim(), done: false }); input.value = ''; render(); }
        }
        function toggle(i) { todos[i].done = !todos[i].done; render(); }
        function del(i) { todos.splice(i, 1); render(); }
        document.getElementById('input').addEventListener('keypress', e => { if (e.key === 'Enter') add(); });
        render();
    </script>
</body>
</html>`;
}

function generateBlogHTML(description, colors) {
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${description}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            min-height: 100vh; background: ${colors.bg}; color: ${colors.text};
        }
        header { padding: 20px 40px; background: rgba(0,0,0,0.2); }
        nav { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; }
        .logo { font-size: 1.5rem; font-weight: bold; }
        .nav-links { display: flex; gap: 30px; list-style: none; }
        .nav-links a { color: inherit; text-decoration: none; opacity: 0.8; }
        main { max-width: 800px; margin: 0 auto; padding: 60px 20px; }
        .hero { text-align: center; margin-bottom: 60px; }
        .hero h1 { font-size: 2.5rem; margin-bottom: 20px; }
        .posts { display: grid; gap: 30px; }
        .post { background: ${colors.card}; padding: 30px; border-radius: 15px; }
        .post h2 { margin-bottom: 10px; }
        .post .meta { opacity: 0.6; font-size: 0.9rem; margin-bottom: 15px; }
        footer { text-align: center; padding: 40px; opacity: 0.6; }
    </style>
</head>
<body>
    <header><nav><div class="logo">📝 我的博客</div><ul class="nav-links"><li><a href="#">首页</a></li><li><a href="#">文章</a></li><li><a href="#">关于</a></li></ul></nav></header>
    <main><div class="hero"><h1>${description}</h1><p>分享技术、生活与思考</p></div>
        <div class="posts">
            <article class="post"><h2>🚀 欢迎使用 Lucky Deploy</h2><div class="meta">2024年 · 自动化部署</div><p>这是一个自动生成的博客页面...</p></article>
            <article class="post"><h2>✨ 现代化前端开发</h2><div class="meta">2024年 · 前端技术</div><p>探索最新的前端开发趋势...</p></article>
        </div>
    </main>
    <footer><p>© 2024 我的博客</p></footer>
</body>
</html>`;
}

function generateLandingHTML(description, colors) {
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${description}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            min-height: 100vh; display: flex; flex-direction: column;
            align-items: center; justify-content: center;
            background: ${colors.bg}; color: ${colors.text}; padding: 20px;
        }
        .container { text-align: center; max-width: 800px; animation: fadeIn 0.8s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        h1 { font-size: clamp(2rem, 5vw, 3.5rem); margin-bottom: 1rem; }
        p { font-size: 1.2rem; opacity: 0.9; margin-bottom: 2rem; }
        .badge { display: inline-block; padding: 10px 20px; background: ${colors.card}; border-radius: 50px; }
        .features { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-top: 3rem; }
        .feature { background: ${colors.card}; padding: 25px; border-radius: 15px; }
        .feature h3 { margin-bottom: 10px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 ${description}</h1>
        <p>由 Lucky 自动生成并部署</p>
        <span class="badge">✨ 自动化部署</span>
        <div class="features">
            <div class="feature"><h3>⚡ 快速</h3><p>一键生成，即时部署</p></div>
            <div class="feature"><h3>🎨 美观</h3><p>现代化设计风格</p></div>
            <div class="feature"><h3>📱 响应式</h3><p>适配各种设备</p></div>
        </div>
    </div>
</body>
</html>`;
}
