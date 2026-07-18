const fs = require('fs');
const path = require('path');

const cssFile = path.join(__dirname, 'styles.css');
const htmlFile = path.join(__dirname, 'index.html');
const jsFile = path.join(__dirname, 'app.js');

let css = fs.readFileSync(cssFile, 'utf8');
let html = fs.readFileSync(htmlFile, 'utf8');
let js = fs.readFileSync(jsFile, 'utf8');

// 1. Replace CSS Variables
css = css.replace(/:root {[\s\S]*?}/, `:root {
    --bg-dark: #0B0F19;
    --bg-glass: rgba(16, 25, 43, 0.65);
    --bg-glass-solid: #0e1628;
    --bg-glass-hover: rgba(16, 25, 43, 0.85);
    --border-glass: rgba(0, 229, 255, 0.25);
    
    --primary: #00E5FF;
    --primary-hover: #00B8CC;
    --secondary: #FF007F;
    --accent: #B000FF;
    
    --text-main: #FFFFFF;
    --text-muted: #8A9BB3;
    
    --status-blue: #00E5FF;
    --status-purple: #B000FF;
    --status-orange: #FF007F;
    --status-green: #00FF9D;
    --status-gray: #8A9BB3;
    
    --font-main: 'Outfit', 'Inter', sans-serif;
    
    --transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    
    /* Issue level colors */
    --issue-normal-bg: rgba(255, 255, 255, 0.05);
    --issue-normal-text: #8A9BB3;
    --issue-warning-bg: rgba(255, 165, 0, 0.15);
    --issue-warning-text: #FFA500;
    --issue-extreme-bg: rgba(255, 0, 127, 0.15);
    --issue-extreme-text: #FF007F;
}`);

// 2. Replace body
css = css.replace(/body {[\s\S]*?}/, `body {
    font-family: var(--font-main);
    background-color: var(--bg-dark);
    color: var(--text-main);
    height: 100vh;
    overflow: hidden;
    background-image: 
        radial-gradient(circle at 10% 20%, rgba(0, 229, 255, 0.1), transparent 40%),
        radial-gradient(circle at 90% 80%, rgba(255, 0, 127, 0.1), transparent 40%),
        radial-gradient(circle at 50% 50%, rgba(176, 0, 255, 0.08), transparent 50%);
}`);

// 3. Replace .glass-panel
css = css.replace(/\.glass-panel {[\s\S]*?}/, `.glass-panel {
    background: var(--bg-glass);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid var(--border-glass);
    border-radius: 16px;
    box-shadow: 
        0 4px 30px rgba(0, 0, 0, 0.5), 
        0 1px 3px rgba(0, 0, 0, 0.3),
        inset 0 0 0 1px rgba(0, 229, 255, 0.1);
}`);

// 4. Buttons and Kanban hover
css = css.replace(/box-shadow: 0 4px 15px rgba\(99, 102, 241, 0.4\);/g, `box-shadow: 0 0 15px rgba(0, 229, 255, 0.6);`);
css = css.replace(/box-shadow: 0 12px 24px rgba\(99, 102, 241, 0.12\);/g, `box-shadow: 0 0 20px rgba(0, 229, 255, 0.4); border-color: var(--primary);`);

// Replace hardcoded #ffffff and #f8fafc with CSS vars everywhere
const lightReplacements = [
    { regex: /background:\s*#ffffff/gi, replacement: 'background: var(--bg-glass-solid)' },
    { regex: /background:\s*#f8fafc/gi, replacement: 'background: var(--bg-glass-solid)' },
    { regex: /background-color:\s*#f1f5f9/gi, replacement: 'background-color: var(--bg-dark)' },
    { regex: /background-color:\s*#ffffff/gi, replacement: 'background-color: var(--bg-glass-solid)' },
    // Specifically handle the admin library dropzone and similar items which use #e2e8f0 borders
    { regex: /border-color:\s*#cbd5e1/gi, replacement: 'border-color: var(--border-glass)' },
    { regex: /border:\s*[\dpx]+ solid #e2e8f0/gi, replacement: 'border: 1px solid var(--border-glass)' },
    { regex: /border:\s*[\dpx]+ dashed #cbd5e1/gi, replacement: 'border: 2px dashed var(--border-glass)' },
    { regex: /border:\s*[\dpx]+ solid #ccc/gi, replacement: 'border: 1px solid var(--border-glass)' },
    { regex: /border:\s*[\dpx]+ solid rgba\(0, 0, 0, 0.1\)/gi, replacement: 'border: 1px solid var(--border-glass)' }
];

[css, html, js].forEach((content, i) => {
    let replaced = content;
    for (const r of lightReplacements) {
        replaced = replaced.replace(r.regex, r.replacement);
    }
    if (i === 0) css = replaced;
    if (i === 1) html = replaced;
    if (i === 2) js = replaced;
});

// Write files back
fs.writeFileSync(cssFile, css);
fs.writeFileSync(htmlFile, html);
fs.writeFileSync(jsFile, js);

console.log('Cyberpunk theme applied successfully!');
