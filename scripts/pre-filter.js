const HARD_REJECT = [
  // Negated sponsorship
  /\bdo(?:es)?\s+not\s+(?:offer|provide|support)?\s*(?:visa\s+)?sponsor/i,
  /\bcannot\s+(?:offer|provide|support)?\s*(?:visa\s+)?sponsor/i,
  /\bunable\s+to\s+(?:offer|provide|support)?\s*(?:visa\s+)?sponsor/i,
  /\bno\s+(?:visa\s+)?sponsorship\b/i,
  /\bsponsorship\s+(?:is\s+)?not\s+(?:available|offered|provided)/i,
  /\bwe\s+don['\u2019]t\s+(?:offer|provide|support)?\s*(?:visa\s+)?sponsor/i,
  /\bwe\s+do\s+not\s+(?:offer|provide|support)?\s*(?:visa\s+)?sponsor/i,
  // Negated relocation
  /\bdo(?:es)?\s+not\s+support\s+relocation\b/i,
  /\bcannot\s+support\s+relocation\b/i,
  /\bno\s+relocation\b/i,
  /\brelocation\s+(?:is\s+)?not\s+(?:provided|available|offered|supported)/i,
  /\bwe\s+don['\u2019]t\s+(?:support|provide|offer)\s+relocation\b/i,
  /\bwe\s+do\s+not\s+(?:support|provide|offer)\s+relocation\b/i,
  // Right-to-work blocks
  /\bmust\s+(?:already\s+)?have\s+(?:the\s+)?right\s+to\s+work\b/i,
  /\bmust\s+be\s+eligible\s+to\s+work\b/i,
  /\bno\s+right\s+to\s+work\s+sponsorship\b/i,
  /\byou\s+must\s+already\s+hold\b/i,
  /\bcandidates\s+must\s+(?:hold|have|be)\b/i,
  /\bapplicants\s+must\s+(?:hold|have|be)\b/i,
  // Citizenship / residency hard walls
  /\bEU\s+citizenship\s+(?:is\s+)?required\b/i,
  /\bmust\s+be\s+(?:an?\s+)?EU\s+citizen\b/i,
  /\bdutch\s+(?:citizen|national|citizenship|nationality)\b/i,
  /\bpermanent\s+resident\s+only\b/i,
  /\bmust\s+hold\s+indefinite\s+leave\b/i,
  // Additional rejection patterns
  /\bonly\s+(?:consider|accepting)\s+(?:local|on-?site)\s+candidates\b/i,
  /\bwork\s+(?:authorization|permit)\s+(?:is\s+)?required\b/i,
  /\bmust\s+be\s+(?:legally\s+)?authorized\s+to\s+work\b/i,
  /\bauthorized\s+to\s+work\s+in\s+(?:the\s+)?(?:US|UK|EU|Netherlands|Germany)\s+(?:is\s+)?required\b/i,
  /\bno\s+work\s+permit\s+(?:support|sponsorship)\b/i
];

const output = [];

for (const item of $input.all()) {
  const job = item.json;
  const text = ((job.title || '') + ' ' + (job.description || ''));

  // 1. Hard reject — drop immediately
  const rejected = HARD_REJECT.find(rx => rx.test(text));
  if (rejected) {
    console.log(`HARD REJECT: ${job.title} @ ${job.company} — matched: ${rejected}`);
    continue;
  }

  // 2. Everything else → LLM
  output.push({
    json: {
      ...job,
      _regex_verdict: 'uncertain',
      _regex_reason: 'no_signal',
      _regex_confidence: 'low'
    }
  });
}

console.log(`Regex results — rejected dropped, ${output.length} passed to LLM`);
return output;