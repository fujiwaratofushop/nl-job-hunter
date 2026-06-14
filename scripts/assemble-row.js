const llmItem = $input.first();
const buildItem = $('Build LLM Request').first();

if (!llmItem?.json || !buildItem?.json) {
  return [];
}

const raw = (llmItem.json?.choices?.[0]?.message?.content || '').trim();

let parsed = { approve: false, confidence: 'low', reason: 'parse_failed', role_match: 'no', role_reason: '', cover_letter: '' };
try {
  parsed = JSON.parse(raw);
} catch (e) {
  return [];
}

const coverLetter = (parsed.cover_letter || '').trim();
if (!coverLetter) {
  return [];
}

const job = buildItem.json;

return [{
  json: {
    date: new Date().toISOString().split('T')[0],
    company: (job.company || '').trim(),
    title: (job.title || '').trim(),
    location: (job.location || '').trim(),
    url: (job.url || ''),
    relocation_reason: (parsed.reason || '').trim(),
    relocation_confidence: (parsed.confidence || '').trim(),
    role_match: (parsed.role_match || '').trim(),
    role_reason: (parsed.role_reason || '').trim(),
    cover_letter: coverLetter,
    status: 'Not Applied'
  }
}];