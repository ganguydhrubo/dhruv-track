const fs = require('fs');
let content = fs.readFileSync('scripts/seed-users.ts', 'utf8');

content = content.replace(/'l1/g, "'c1");
content = content.replace(/'r1/g, "'b1");
content = content.replace(/'ro0/g, "'ce0");

fs.writeFileSync('scripts/seed-users.ts', content);
console.log('Normalized IDs in seed-users.ts!');
