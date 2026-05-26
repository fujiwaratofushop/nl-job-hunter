const llmItem = $input.first();
const reqItem = $('Build Cover Letter Request').first();

if (!llmItem?.json || !reqItem?.json) {
  return [];
}

const coverLetter = (llmItem.json?.choices?.[0]?.message?.content || '').trim();

if (!coverLetter) {
  return [];
}

const job = reqItem.json;

return [{
  json: {
    date: new Date().toISOString().split('T')[0],
    company: (job.company || '').trim(),
    title: (job.title || '').trim(),
    location: (job.location || '').trim(),
    url: (job.url || '').trim(),
    relocation_reason: (job.relocation_reason || '').trim(),
    relocation_confidence: (job.relocation_confidence || '').trim(),
    cover_letter: coverLetter,
    status: 'Not Applied'
  }
}];
