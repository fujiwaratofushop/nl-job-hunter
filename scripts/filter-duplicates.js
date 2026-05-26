const normalizeUrl = (url = '') => url.toString().split('?')[0].replace(/\/$/, '').trim().toLowerCase();
const normalizeText = (v = '') => v.toString().trim().toLowerCase();

const existing = new Set();

let sheetRows = [];
try {
  sheetRows = $('Get Existing Jobs').all();
} catch (e) {
  sheetRows = [];
}

for (const row of sheetRows) {
  const r = row.json || {};
  const url = r.URL || r.Url || r.url || '';

  if (!url) continue;

  const key = [
    normalizeUrl(url),
    normalizeText(r.Company || r.company || ''),
    normalizeText(r.Role || r.role || '')
  ].join('|');

  existing.add(key);
}

const output = [];

for (const item of $input.all()) {
  const job = item.json || {};

  if (!job.url || !job.title) continue;

  const key = [
    normalizeUrl(job.url),
    normalizeText(job.company || ''),
    normalizeText(job.title)
  ].join('|');

  if (existing.has(key)) {
    console.log(`Duplicate skipped: ${job.title} @ ${job.company}`);
    continue;
  }

  output.push({ json: job });
}

console.log(`New unique jobs after dedup: ${output.length}`);
return output;
