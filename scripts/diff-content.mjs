import { readFileSync } from 'node:fs';

const strip = html =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<svg[\s\S]*?<\/svg>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const oldHtml = readFileSync(process.argv[2], 'utf8');
const newHtml = readFileSync(process.argv[3], 'utf8');

const oldText = strip(oldHtml);
const newText = strip(newHtml);

// Every "meaningful token" in the old text: words of 4+ chars, lowercased.
const oldTokens = [...new Set((oldText.toLowerCase().match(/[a-z][a-z0-9+#.\/-]{3,}/g) || []))];
const newSet = new Set((newText.toLowerCase().match(/[a-z][a-z0-9+#.\/-]{3,}/g) || []));

const missing = oldTokens.filter(t => !newSet.has(t));

// Group by first letter for readability.
const groups = {};
for (const t of missing) {
  const k = t[0];
  (groups[k] ||= []).push(t);
}

console.log('old tokens:', oldTokens.length, '| missing from new:', missing.length);
console.log();
for (const k of Object.keys(groups).sort()) {
  console.log(k.toUpperCase() + ': ' + groups[k].join(', '));
}
