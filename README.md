# NL Job Hunter

Scrapes LinkedIn daily for Netherlands jobs with visa/relocation sponsorship,
filters with a local LLM, and writes a cover letter for each match.
Results land in `output/nl_jobs.xlsx`.

---

## Prerequisites

- Docker Desktop (Windows): https://www.docker.com/products/docker-desktop/
- llama.cpp server running locally on port 8080 with a Qwen3 model loaded
- Apify account + API token: https://console.apify.com/account/integrations

---

## Setup

### 1. Fill in .env

Edit `.env` and set:

```
N8N_ENCRYPTION_KEY   — any random 32-char string
APIFY_API_TOKEN      — from your Apify account
LLAMA_CPP_URL        — leave default if llama.cpp is on port 8080
```

To generate a random key, run this in PowerShell:
```powershell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})
```

### 2. Start llama.cpp

Make sure your llama.cpp server is running on port 8080 with a Qwen3 model.
The workflow uses model name `unsloth/Qwen3.5-9B-GGUF:Q6_K-GGUF:Q6_K` — adjust in the workflow nodes if yours differs.

### 3. Start n8n

Double-click `start.bat`

### 4. Import the workflow

1. Open http://localhost:5678
2. Create an account (local only, no internet needed)
3. Top-left menu → Workflows → Import from file → select `workflow.json`
4. Toggle the workflow to Active

---

## Output

Every weekday at 8AM IST, the workflow:
1. Scrapes ~50 LinkedIn jobs in Netherlands posted in last 24h
2. Filters for visa/relocation sponsorship via local LLM
3. Generates a tailored cover letter for each match
4. Appends rows to `output/nl_jobs.xlsx`

Columns: Date | Company | Role | Location | URL | Reloc Signals | Confidence | Cover Letter | Status

---

## Adjusting search keywords

Edit the `Scrape LinkedIn Jobs` node → JSON body → `urls` array.
Current searches:
- software engineer Netherlands relocation
- senior developer Amsterdam visa sponsor
- AI engineer Netherlands sponsorship

---

## Stopping

Double-click `stop.bat`  
Or: `docker compose down` in this folder.

---

## Troubleshooting

**n8n won't start — llama.cpp healthcheck failing**
→ Make sure llama.cpp is running before you run start.bat.
→ Test: open http://localhost:8080/health in your browser. Should return `{"status":"ok"}`.

**Workflow runs but Excel is empty**
→ Check workflow execution logs in n8n (left sidebar → Executions).
→ LLM may be returning malformed JSON — lower temperature or check model.

**`exceljs` not found error in Code node**
→ This is bundled with n8n. If you're on a very old n8n version, update the image:
   `docker compose pull && docker compose up -d`
