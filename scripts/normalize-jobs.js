const results = [];

for (const item of $input.all()) {
  const j = item.json;

  const url = (j.jobUrl || j.url || j.link || '')
    .trim()
    .replace(/\?.*$/, '')
    .toLowerCase();
  const title = (j.title || j.jobTitle || j.position || j.positionName || '').trim();
  const company = (j.company || j.companyName || '').trim();

  const rawLocation = j.location || j.jobLocation || '';
  let location;
  if (typeof rawLocation === 'object' && rawLocation !== null) {
    location = rawLocation.formattedAddressShort || rawLocation.fullAddress || rawLocation.city || '';
  } else {
    location = rawLocation;
  }
  location = String(location).trim();

  const description = (j.description || j.jobDescription || j.descriptionHtml || '').trim();

  if (!url || !title || !description || description.length < 100) {
    continue;
  }

  results.push({ json: { url, title, company, location, description } });
}

console.log(`Jobs after normalization: ${results.length}`);
return results;
