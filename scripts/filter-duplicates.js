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

// Apply Regex Hard Filter
const HARD_REJECT = [
  /\bdo(?:es)?\s+not\s+(?:offer|provide|support)?\s*(?:visa\s+)?sponsor/i,
  /\bcannot\s+(?:offer|provide|support)?\s*(?:visa\s+)?sponsor/i,
  /\bunable\s+to\s+(?:offer|provide|support)?\s*(?:visa\s+)?sponsor/i,
  /\bno\s+(?:visa\s+)?sponsorship\b/i,
  /\bsponsorship\s+(?:is\s+)?not\s+(?:available|offered|provided)/i,
  /\bwe\s+don['\u2019]t\s+(?:offer|provide|support)?\s*(?:visa\s+)?sponsor/i,
  /\bwe\s+do\s+not\s+(?:offer|provide|support)?\s*(?:visa\s+)?sponsor/i,
  /\bdo(?:es)?\s+not\s+support\s+relocation\b/i,
  /\bcannot\s+support\s+relocation\b/i,
  /\bno\s+relocation\b/i,
  /\brelocation\s+(?:is\s+)?not\s+(?:provided|available|offered|supported)/i,
  /\bwe\s+don['\u2019]t\s+(?:support|provide|offer)\s+relocation\b/i,
  /\bwe\s+do\s+not\s+(?:support|provide|offer)\s+relocation\b/i,
  /\bmust\s+(?:already\s+)?have\s+(?:the\s+)?right\s+to\s+work\b/i,
  /\bmust\s+be\s+eligible\s+to\s+work\b/i,
  /\bno\s+right\s+to\s+work\s+sponsorship\b/i,
  /\byou\s+must\s+already\s+hold\b/i,
  /\bcandidates\s+must\s+(?:hold|have|be)\b/i,
  /\bapplicants\s+must\s+(?:hold|have|be)\b/i,
  /\bEU\s+citizenship\s+(?:is\s+)?required\b/i,
  /\bmust\s+be\s+(?:an?\s+)?EU\s+citizen\b/i,
  /\bdutch\s+(?:citizen|national|citizenship|nationality)\b/i,
  /\bpermanent\s+resident\s+only\b/i,
  /\bmust\s+hold\s+indefinite\s+leave\b/i,
  /\bonly\s+(?:consider|accepting)\s+(?:local|on-?site)\s+candidates\b/i,
  /\bwork\s+(?:authorization|permit)\s+(?:is\s+)?required\b/i,
  /\bmust\s+be\s+(?:legally\s+)?authorized\s+to\s+work\b/i,
  /\bno\s+work\s+permit\s+(?:support|sponsorship)\b/i
];

const HARD_APPROVE = [
  /\bwe\s+(?:offer|provide|support|will\s+sponsor)\s+(?:visa|work\s+permit)\s+sponsorship\b/i,
  /\bvisa\s+sponsorship\s+(?:is\s+)?(?:available|offered|provided|supported)\b/i,
  /\bsponsorship\s+(?:is\s+)?(?:available|offered|provided)\s+for\s+(?:this\s+)?(?:role|position)\b/i,
  /\bwill\s+sponsor\s+(?:a\s+)?(?:visa|work\s+permit)\b/i,
  /\bvisa\s+support\s+(?:is\s+)?(?:available|provided|offered)\b/i,
  /\bwork\s+permit\s+(?:support|sponsorship|assistance)\s+(?:is\s+)?(?:available|provided|offered)\b/i,
  /\bkennismigrant\b/i,
  /\bhighly\s+skilled\s+migrant\b/i,
  /\bHSM\s+(?:visa|permit|sponsorship)\b/i,
  /\bEU\s+Blue\s+Card\b/i,
  /\bblue\s+card\s+sponsorship\b/i,
  /\brelocation\s+(?:package|assistance|support|allowance|budget)\s+(?:is\s+)?(?:available|provided|offered|included)\b/i,
  /\bwe\s+(?:offer|provide|support)\s+relocation\b/i,
  /\bfull\s+relocation\s+(?:package|support|assistance)\b/i,
  /\brelocation\s+covered\b/i,
  /\bopen\s+to\s+(?:international|global|worldwide)\s+(?:applicants?|candidates?)\b/i,
  /\binternational\s+candidates?\s+(?:are\s+)?(?:welcome|encouraged\s+to\s+apply)\b/i,
  /\bglobal\s+talent\s+(?:welcome|program)\b/i,
  /\bwelcome\s+applicants?\s+from\s+(?:outside|abroad|any\s+country)\b/i,
  /\bIND\s+(?:application|process|sponsorship|registration)\b/i,
  /\bregistered\s+(?:IND\s+)?(?:knowledge\s+)?migrant\s+sponsor\b/i
];

const filteredOutput = [];

for (const item of output) {
  const job = item.json;
  const text = ((job.title || '') + ' ' + (job.description || ''));

  const rejected = HARD_REJECT.find(rx => rx.test(text));
  if (rejected) {
    console.log(`HARD REJECT: ${job.title} @ ${job.company} — matched: ${rejected}`);
    continue;
  }

  const approved = HARD_APPROVE.find(rx => rx.test(text));
  if (approved) {
    console.log(`HARD APPROVE: ${job.title} @ ${job.company} — matched: ${approved}`);
    filteredOutput.push({
      json: {
        ...job,
        _regex_verdict: 'approved',
        _regex_reason: approved.toString(),
        _regex_confidence: 'high'
      }
    });
    continue;
  }

  filteredOutput.push({
    json: {
      ...job,
      _regex_verdict: 'uncertain',
      _regex_reason: 'no_signal',
      _regex_confidence: 'low'
    }
  });
}

const approved_count = filteredOutput.filter(i => i.json._regex_verdict === 'approved').length;
const uncertain_count = filteredOutput.filter(i => i.json._regex_verdict === 'uncertain').length;
console.log(`Regex results — approved: ${approved_count}, uncertain (→LLM): ${uncertain_count}`);
return filteredOutput;
