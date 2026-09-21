const fs = require('fs');
let content = fs.readFileSync('supabase/seed.sql', 'utf8');

content = content.replace(/'l1/g, "'c1");
content = content.replace(/\/l1/g, "/c1");
content = content.replace(/'r1/g, "'b1");
content = content.replace(/'v1/g, "'d1");
content = content.replace(/'ct0/g, "'ca0");
content = content.replace(/'tc0/g, "'cb0");
content = content.replace(/'it0/g, "'cc0");
content = content.replace(/'ro0/g, "'ce0");

fs.writeFileSync('supabase/seed.sql', content);
console.log('All IDs normalized to valid hex in seed.sql!');
