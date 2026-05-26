const results = [];

for (const item of $input.all()) {
  const job = item.json;

  const trimmedDescription = (job.description || '');

  const payload = {
    model: 'unsloth/Qwen3.5-9B-GGUF:Q6_K',
    temperature: 0.1,
    max_tokens: 10000,
    top_p: 0.9,
    repeat_penalty: 1.05,
    stop: ['<|im_end|>', '</s>'],
    messages: [
      {
        role: 'system',
        content: `You are an expert technical recruiter.

Analyze whether this job is suitable for an Indian software engineer relocating to the Netherlands.

Return ONLY valid JSON.

Rules:
- approve=true if the role likely supports visa sponsorship, relocation, kennismigrant hiring, or international candidates.
- approve=false if the role clearly requires Dutch only, EU citizenship, existing work authorization, or explicitly says no sponsorship.
- confidence should be: high, medium, or low.
- reason should be short.

JSON format:
{
  "approve": true,
  "confidence": "high",
  "reason": "mentions visa sponsorship"
}`
      },
      {
        role: 'user',
        content: `Job Title: ${job.title}
Company: ${job.company}
Location: ${job.location}

Description:
${trimmedDescription}`
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
      _relocationPayload: payload
    }
  });
}

return results;
