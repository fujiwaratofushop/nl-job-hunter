const results = [];

for (const item of $input.all()) {
  const job = item.json;

  const coverLetterTemplate = `Dear Hiring Team,
I am writing to express my interest in the [JOB_TITLE] position at [COMPANY_NAME]. With over 7 years of full-stack engineering experience — most recently as a Senior Software Engineer (SDE3 / Associate Vice President) at JPMorgan Chase Asset & Wealth Management — I bring deep expertise in React, TypeScript, Python, AWS, and AI-native system design, and I am actively pursuing relocation to Europe.

At JPMorgan, I architected MCP server infrastructure and built Connect Studio — an AI-native multi-persona platform that bridges LLM capabilities with real-world engineering workflows at scale. Prior to this, at Aurigo Software Technologies, I led frontend architecture across multiple product lines, delivered products and platforms serving 1,000+ concurrent users, and pioneered an EAA/ADA/WCAG accessibility initiative recognised in a company press release. I hold a B.E. from BITS Pilani and have mentored 10+ engineers across cross-functional teams.

[COMPANY_SPECIFIC_PARAGRAPH]

I am available for interviews at your convenience and am prepared to relocate upon offer. My compensation expectation aligns with the relevant Highly Skilled Migrant salary threshold for my age bracket, and I am open to discussing further.

Warm regards,
Shirsak Sahoo
shirsaksahoo96@gmail.com | +91-7997187900 | linkedin.com/in/shirsaksahoo`;

  const payload = {
    model: 'unsloth/Qwen3.5-9B-GGUF:Q6_K',
    temperature: 0.2,
    max_tokens: 10000,
    top_p: 0.9,
    repeat_penalty: 1.05,
    stop: ['\n', '</s>'],
    messages: [
      {
        role: 'system',
        content: `You are an expert technical recruiter and cover letter writer for senior software engineering roles.

Your task has TWO parts. Analyze the job posting, then write a tailored cover letter if approved.

Return ONLY valid JSON — no prose, no markdown, no explanation outside the JSON.

## PART 1 — Relocation/Sponsorship Analysis

### HARD REJECT — set approve=false immediately if the description contains ANY of:
- Negated sponsorship: "do not sponsor", "cannot sponsor", "unable to sponsor", "no sponsorship", "sponsorship not available", "we do not offer visa", "we don't offer visa"
- Negated relocation: "do not support relocation", "cannot support relocation", "no relocation", "relocation not provided", "we do not provide relocation", "we don't support relocation"
- Right-to-work restrictions: "must have right to work", "must be eligible to work", "must already have", "no right to work sponsorship", "candidates must hold", "applicants must be", "you must already hold"
- Citizenship/residency requirements: "EU citizenship required", "must be EU citizen", "dutch citizen", "dutch nationality", "permanent resident only", "must hold indefinite leave"

IMPORTANT: The presence of the word 'relocation' or 'sponsorship' alone does NOT make a job approvable — read the FULL phrase for polarity. "We support relocation" = positive. "We do NOT support relocation" = hard reject.

### APPROVE — set approve=true only if the description clearly states:
- Explicit visa sponsorship offered: "visa sponsorship", "we sponsor visas", "sponsorship available", "visa support provided"
- Explicit relocation support: "relocation package", "relocation assistance", "we support relocation", "relocation provided"
- Kennismigrant / Highly Skilled Migrant / HSM / Blue Card sponsorship mentioned
- International candidates explicitly welcomed: "open to international applicants", "global candidates welcome"

### UNCERTAIN — set approve=false
If nothing about sponsorship or work authorization is mentioned, approve=false. No benefit of the doubt.

## PART 2 — Cover Letter (only if approve=true)

If approve=true: write a professional, human-sounding cover letter using the base template provided. Replace all placeholders. Write a concise company-specific paragraph. Keep it under 500 words. No markdown. No bullet points. No AI mentions.

If approve=false: set cover_letter to empty string "".

## Output JSON format — return exactly this structure:
{
  "approve": true,
  "confidence": "high",
  "reason": "mentions visa sponsorship",
  "cover_letter": "Dear Hiring Team, ..."
}`
      },
      {
        role: 'user',
        content: `Job Title: ${job.title}
Company: ${job.company}
Location: ${job.location}

Base cover letter template:
${coverLetterTemplate}

Candidate details:
Name: Shirsak Sahoo
Experience: 7+ years
Email: shirsaksahoo96@gmail.com
Phone: +91-7997187900
LinkedIn: linkedin.com/in/shirsaksahoo

Job Description:
${(job.description || '')}`
      }
    ],
    extra_body: {
      chat_template_kwargs: {
        enable_thinking: false
      }
    }
  };

  results.push({
    json: {
      ...job,
      _llmPayload: payload
    }
  });
}

return results;