// Build LLM payload for cover letter generation
const relocationResp = $('LLM Relocation Analysis').first().json;
const buildNode = $('Build Relocation Analysis Request').first().json;

const raw = relocationResp?.choices?.[0]?.message?.content || '{}';
let relocation = { approve: false, confidence: 'low', reason: 'parse_failed' };

try {
  relocation = JSON.parse(raw);
} catch (e) {
  console.log('Error parsing relocation response:', e.message);
}

const job = buildNode;

// Load resume data from master-resume.json
const fs = require('fs');
const path = require('path');
const ROOT_DIR = path.join(__dirname, '..');
const resumePath = path.join(ROOT_DIR, 'prompts', 'master-resume.json');
let resumeData = { yearsOfExperience: '7', name: '[YOUR_NAME]' };

try {
  const resumeContent = fs.readFileSync(resumePath, 'utf8');
  resumeData = JSON.parse(resumeContent);
} catch (err) {
  console.log('Could not load resume data, using defaults:', err.message);
}

const coverLetterTemplate = `Dear [HIRING_MANAGER / Hiring Team],

I am writing to express my interest in the [JOB_TITLE] position at [COMPANY_NAME]. With over [YEARS_OF_EXPERIENCE] years of experience in software engineering, I bring strong expertise in scalable web applications, cloud-native systems, distributed architectures, and modern frontend/backend technologies.

Throughout my career, I have worked across full-stack engineering, platform architecture, AI-integrated systems, and developer tooling. My experience includes building scalable applications using technologies such as React, TypeScript, Node.js, Python, cloud infrastructure, APIs, microservices, and modern engineering workflows. I have also contributed to technical leadership, mentoring engineers, improving development practices, and delivering production-grade systems at scale.

In my recent roles, I have worked on architecting internal platforms, AI-native workflows, enterprise applications, and reusable engineering systems that improve developer productivity and product scalability. I enjoy solving complex technical problems while balancing performance, maintainability, reliability, and user experience.

[COMPANY_SPECIFIC_PARAGRAPH]

What particularly interests me about this opportunity is the chance to contribute to impactful products while collaborating with strong engineering teams in a fast-paced environment. I am excited by opportunities where I can combine hands-on engineering with architectural thinking and long-term technical strategy.

I would welcome the opportunity to further discuss how my background aligns with [COMPANY_NAME]'s goals. Please find my resume attached for your review.

Best regards,
[YOUR_NAME]`;

const payload = {
  model: 'unsloth/Qwen3.5-9B-GGUF:Q6_K',
  temperature: 0.7,
  max_tokens: 2000,
  top_p: 0.9,
  repeat_penalty: 1.05,
  stop: ['\n\n', '</s>'],
  messages: [
    {
      role: 'system',
      content: 'You are an expert technical recruiter. Write a tailored cover letter for the job position described below. The candidate is an Indian software engineer seeking relocation to the Netherlands. The cover letter should be professional, concise, and highlight relevant technical skills. Do not include markdown formatting. Keep the tone confident but humble.'
    },
    {
      role: 'user',
      content: `Job Title: ${job.title}
Company: ${job.company}
Location: ${job.location}
Relocation Reason: ${relocation.reason}
Confidence Level: ${relocation.confidence}
Candidate Name: ${resumeData.name}
Years of Experience: ${resumeData.yearsOfExperience}

Generate a cover letter using the template above. Replace placeholders with actual values. For [COMPANY_SPECIFIC_PARAGRAPH], write 2-3 sentences about why this company is interesting based on the job description.`
    }
  ],
  extra_body: {
    chat_template_kwargs: {
      enable_thinking: false
    }
  }
};

return [{
  json: {
    _llmPayload: payload
  }
}];
