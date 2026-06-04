// Assemble row for approved jobs after cover letter generation
const llmItem = $input.first().json;
const buildItem = $input.first().json;

if (!llmItem?.json?.choices || !buildItem?.json) {
  return [];
}

const raw = (llmItem.json.choices[0].message.content || '').trim();

let parsed = { approve: false, confidence: 'low', reason: 'parse_failed', cover_letter: '' };
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
    url: (job.url || '')
      .trim()
      .replace(/\?.*$/, '')
      .toLowerCase(),
    relocation_reason: (parsed.reason || '').trim(),
    relocation_confidence: (parsed.confidence || '').trim(),
    cover_letter: coverLetter,
    status: 'Not Applied'
  }
}];