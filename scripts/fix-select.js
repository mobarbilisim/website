const fs = require('fs');
let c = fs.readFileSync('src/app/admin/homepage/page.tsx', 'utf8');

const oldText = `<option value="">\u00c7iniz...</option>
                       {systemCategories.map(c => (
                         <option key={c.id} value={c.id}>{c.name}</option>
                       ))}`;

const newText = `<option value="">-- Kategori Se\u00e7in --</option>
                       {systemCategories
                         .filter((c: any) => !c.parent_id)
                         .map((parent: any) => {
                           const kids = systemCategories.filter((ch: any) => ch.parent_id === parent.id);
                           return kids.length > 0 ? (
                             <optgroup key={parent.id} label={parent.name}>
                               <option value={parent.id}> T\u00fcm\u00fc: {parent.name}</option>
                               {kids.map((ch: any) => (
                                 <option key={ch.id} value={ch.id}>  - {ch.name}</option>
                               ))}
                             </optgroup>
                           ) : (
                             <option key={parent.id} value={parent.id}>{parent.name}</option>
                           );
                         })}`;

// Fix the Turkish character issue first
const search = 'Se\u00e7iniz...';
if (!c.includes(search)) {
  console.error('Target text NOT FOUND in file');
  process.exit(1);
}

c = c.replace(
  `<option value="">${search}</option>\n                       {systemCategories.map(c => (\n                         <option key={c.id} value={c.id}>{c.name}</option>\n                       ))}`,
  newText
);

fs.writeFileSync('src/app/admin/homepage/page.tsx', c, 'utf8');
console.log('Done!');
