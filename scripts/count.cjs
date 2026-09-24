const fs = require('fs');
const path = require('path');
const dir = 'C:/sih/src/data/interviewQuestions/banks';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts'));
let total = 0;
for (const f of files) {
  const content = fs.readFileSync(path.join(dir, f), 'utf-8');
  const count = (content.match(/"?id"?\s*:\s*['"][a-zA-Z0-9_-]+['"]/g) || []).length;
  console.log(f.padEnd(30), count);
  total += count;
}
console.log('TOTAL QUESTIONS ACROSS 28 BANKS:', total);
