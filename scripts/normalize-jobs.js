const results = [];

for (const item of $input.all()) {
  const j = item.json;

  const url = (j.jobUrl || j.url || j.link || '').trim();
  const title = (j.title || j.jobTitle || j.position || '').trim();
  const company = (j.company || j.companyName || '').trim();
  const location = (j.location || j.jobLocation || '').trim();
  const description = (j.description || j.jobDescription || j.descriptionHtml || '').trim();

  if (!url || !title || !description || description.length < 100) {
    continue;
  }

  results.push({
    json: {
      url,
      title,
      company,
      location,
      description
    }
  });
}

console.log(`Jobs after normalization: ${results.length}`);
return results;
