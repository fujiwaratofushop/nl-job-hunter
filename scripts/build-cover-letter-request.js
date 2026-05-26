const relocationResp = $('LLM Relocation Analysis').first().json;
const buildNode = $('Build Relocation Analysis Request').first().json;

const raw = relocationResp?.choices?.[0]?.message?.content || '{}';

let relocation = {
  approve: false,
  confidence: 'low',
  reason: 'parse_failed'
};

try {
  relocation = JSON.parse(raw);
} catch (e) {}

const job = buildNode;

const coverLetterTemplate = `Dear [HIRING_MANAGER / Hiring Team],
I am writing to express my interest in the [JOB_TITLE] position at [COMPANY_NAME]. With over 7 years of full-stack engineering experience — most recently as a Senior Software Engineer (SDE3 / Associate Vice President) at JPMorgan Chase Asset & Wealth Management — I bring deep expertise in React, TypeScript, Python, AWS, and AI-native system design, and I am actively pursuing relocation to the Netherlands under the Kennismigrant (Highly Skilled Migrant) pathway.

At JPMorgan, I architected MCP server infrastructure and built Connect Studio — an AI-native multi-persona platform that bridges LLM capabilities with real-world engineering workflows at scale. Prior to this, at Aurigo Software Technologies, I led frontend architecture across multiple product lines, delivered products and platforms serving 1,000+ concurrent users, and pioneered an EAA/ADA/WCAG accessibility initiative recognised in a company press release. I hold a B.E. from BITS Pilani and have mentored 10+ engineers across cross-functional teams.

[COMPANY_SPECIFIC_PARAGRAPH]

I am available for interviews at your convenience and am prepared to relocate to the Netherlands upon offer. My compensation expectation aligns with the Kennismigrant salary threshold for my age bracket, and I am open to discussing further.

Warm regards,
Shirsak Sahoo
shirsaksahoo96@gmail.com | +91-7997187900 | linkedin.com/in/shirsaksahoo`;

const payload = {
  model: 'unsloth/Qwen3.5-9B-GGUF:Q6_K',
  temperature: 0.35,
  max_tokens: 10000,
  top_p: 0.9,
  repeat_penalty: 1.1,
  stop: ['</s>'],
  messages: [
    {
      role: 'system',
      content: `You are an expert technical cover letter writer for senior software engineering roles.

Your task is to customize a professional, human-sounding cover letter for each job application.

Rules:
- Output ONLY the final cover letter
- Replace all placeholders correctly
- Write a concise but strong company-specific paragraph
- Align technical experience with the job description
- Keep tone professional and natural
- Avoid exaggeration and generic buzzwords
- No markdown
- No bullet points
- Keep it under 500 words
- Do not mention AI assistance`
    },
    {
      role: 'user',
      content: `Base template:
${coverLetterTemplate}

Candidate details:
Name: Shirsak Sahoo
Experience: 7+
Email: shirsaksahoo96@gmail.com
Phone: +91-7997187900
LinkedIn: linkedin.com/in/shirsaksahoo

Job title: ${job.title}
Company: ${job.company}
Location: ${job.location}

Relocation analysis:
${JSON.stringify(relocation)}

Job description:
${(job.description || '')}`
    }
  ],
  extra_body: {
    chat_template_kwargs: {
      enable_thinking: false
    }
  }
};

return [{ json: { ...job, relocation_reason: relocation.reason, relocation_confidence: relocation.confidence, _llmPayload: payload } }];
