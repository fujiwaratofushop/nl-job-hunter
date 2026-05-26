// Assemble job row data for Google Sheets
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
    company: job.company || '',
    title: job.title || '',
    location: job.location || '',
    url: job.url || '',
    relocation_reason: job.relocation_reason || '',
    relocation_confidence: job.relocation_confidence || '',
    cover_letter: coverLetter,
    status: 'Not Applied'
  }
}];
