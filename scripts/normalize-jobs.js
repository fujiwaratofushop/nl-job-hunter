// Normalize and clean job data from LinkedIn scraper
const results = [];

for (const item of $input.all()) {
  const j = item.json;

  const url = (j.jobUrl || j.url || j.link || '').toString().trim();
  const title = (j.title || j.jobTitle || j.position || '').toString().trim();
  const company = (j.company || j.companyName || '').toString().trim();
  const location = (j.location || j.jobLocation || '').toString().trim();
  const description = (j.description || j.jobDescription || j.descriptionHtml || '').toString().trim();

  // Skip if any required field is missing or description is too short
  if (!url || !title || !description || description.length < 100) {
    console.log(`Skipping invalid job: ${title || 'unknown'} - ${url || 'no URL'}`);
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
