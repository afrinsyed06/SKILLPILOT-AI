const fs = require('fs');
const path = require('path');

let lucide;
try { lucide = require('lucide-react'); } catch(e) { console.log('Cannot load lucide'); process.exit(1); }

const srcDir = './src';
function walk(dir) {
  let files = [];
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) files = [...files, ...walk(full)];
    else if (f.endsWith('.jsx') || f.endsWith('.js')) files.push(full);
  }
  return files;
}

const files = walk(srcDir);
const importRe = /import\s*\{([^}]+)\}\s*from\s*['"]lucide-react['"]/g;
const bad = [];

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  importRe.lastIndex = 0;
  let m;
  while ((m = importRe.exec(content)) !== null) {
    const names = m[1].split(',').map(s => s.trim()).filter(Boolean);
    for (const name of names) {
      if (!lucide[name]) bad.push(file.replace('./src/', '') + ' -> ' + name);
    }
  }
}

if (bad.length === 0) console.log('ALL GOOD - no bad icons');
else console.log('BAD ICONS FOUND:\n' + bad.join('\n'));
