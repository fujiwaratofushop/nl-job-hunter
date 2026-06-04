const job = $input.first().json;

const coverLetterTemplate = `Dear Hiring Team,
I am writing to express my interest in the [JOB_TITLE] position at [COMPANY_NAME]. With over 7 years of full-stack engineering experience, I bring deep expertise in React, TypeScript, Python, AWS, and AI-native system design, and I am actively pursuing relocation to Europe.

At JPMorgan, I architected MCP server infrastructure and built Connect Studio. Prior to this, at Aurigo Software Technologies, I led frontend architecture across multiple product lines. I hold a B.E. from BITS Pilani and have mentored 10+ engineers.

[COMPANY_SPECIFIC_PARAGRAPH]

I am available for interviews at your convenience and am prepared to relocate upon offer.

Warm regards,
Shirsak Sahoo
shirsaksahoo96@gmail.com | +91-7997187900 | linkedin.com/in/shirsaksahoo`;

const payload = {
  model: 'unsloth/Qwen3.5-9B-GGUF:Q6_K',
  temperature: 0.2,
  max_tokens: 10000,
  top_p: 0.9,
  repeat_penalty: 1.05,
  stop: ['</s>', '\n\n'],
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

Job description:
${job.description || ''}`
    }
  ]
};

return [{ json: { ...job, _llmPayload: payload } }];