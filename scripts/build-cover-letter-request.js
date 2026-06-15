const results = [];

for (const item of $input.all()) {
  const job = item.json;

  const coverLetterTemplate = `Dear Hiring Team,

I am writing to express my interest in the [JOB_TITLE] position at [COMPANY_NAME]. With over 7 years of full-stack engineering experience — most recently as a Senior Software Engineer (SDE3 / Associate Vice President) at JPMorgan Chase Asset & Wealth Management — I bring deep expertise in React, TypeScript, Python, AWS, and AI-native system design, and I am actively pursuing relocation to Europe.

At JPMorgan, I work on Connect OS, an internal AI-native platform serving 10,000+ developers, designers, and advisors. I have architected MCP servers giving LLMs RAG-based access to our design system and component APIs, cutting development and migration time by roughly 70%. I also built Connect Studio, a multi-persona AI platform supporting design-to-code, story-to-code, and Jira-to-code workflows, reducing time-to-review from days to seconds. Prior to this, at Aurigo Software Technologies, I led frontend architecture across multiple product lines, built a drag-and-drop workflow builder serving 1,000+ concurrent users, contributed to an LLM-powered product on AWS SageMaker, and led an accessibility initiative recognized in a company press release. I hold a B.E. in Electrical and Electronics Engineering from BITS Pilani with a Finance minor, and have mentored 10+ engineers.

[COMPANY_SPECIFIC_PARAGRAPH]

I am available for interviews at your convenience and prepared to relocate upon offer. My compensation expectation aligns with the relevant Highly Skilled Migrant salary threshold for my age bracket, and I am open to discussing further.

Warm regards,
Shirsak Sahoo
shirsaksahoo96@gmail.com | +91-7997187900 | linkedin.com/in/shirsaksahoo`;

  const payload = {
    model: 'unsloth/Qwen3.5-9B-GGUF:Q6_K',
    temperature: 0.2,
    max_tokens: 20000,
    top_p: 0.9,
    repeat_penalty: 1.05,
    stop: ['\n', '</s>'],
    messages: [
      {
        role: 'system',
        content: `You are an expert technical recruiter and cover letter writer for senior software engineering roles.

Your task has THREE parts. Analyze the job posting, then write a tailored cover letter only if BOTH checks pass.

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

## PART 2 — Role Alignment Check

Compare the job description against the candidate's actual background: Senior Full-Stack/AI Engineer with React, TypeScript, Python, AWS, LLM/RAG integration, MCP servers, agentic systems, microfrontends, and design systems experience (7+ years, IC track, no backend-heavy Java/Spring-only roles, no pure data science/ML research roles, no DevOps/SRE-only roles, no QA/testing-only roles).

### REJECT — set role_match="no" if the role is primarily:
- Pure data science / ML research (model training, research papers, PhD-level ML theory) with no software engineering component
- Backend-only roles in unrelated stacks (Java/Spring, Go, Ruby on Rails) with no frontend/React/TS overlap and no AI/LLM component
- DevOps/SRE/Infrastructure-only roles with no application engineering
- QA/Test automation only roles
- Roles requiring 10+ years senior leadership/EM/Director level that mismatch candidate's IC-track seniority
- Roles in domains entirely unrelated to candidate's stack with no transferable overlap (e.g., embedded systems, mobile-only iOS/Android with no web/React)

### APPROVE — set role_match="yes" if the role substantially matches ANY of:
- Full-stack / Frontend Software Engineer (React/TypeScript/JavaScript)
- AI Engineer / AI Platform Engineer / Applied AI Engineer (LLM, RAG, agentic systems, MCP)
- Senior/Staff Software Engineer with AI-native or AI-integration focus
- Platform Engineer working on developer tooling, design systems, or internal platforms

If role_match="no", set approve=false regardless of Part 1 result.

## PART 3 — Cover Letter (only if approve=true AND role_match="yes")

If approve=true and role_match="yes": write a professional, human-sounding cover letter using the base template provided. Replace all placeholders. Write a concise company-specific paragraph. Keep it under 500 words. No markdown. No bullet points. No AI mentions.

Otherwise: set cover_letter to empty string "".

## Output JSON format — return exactly this structure:
{
  "approve": true,
  "confidence": "high",
  "reason": "mentions visa sponsorship",
  "role_match": "yes",
  "role_reason": "Senior full-stack role with React/TS and AI integration matches candidate background",
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