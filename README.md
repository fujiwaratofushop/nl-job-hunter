# NL Job Hunter

Scrapes LinkedIn daily for Netherlands jobs with visa/relocation sponsorship,
filters with a local LLM, and writes a cover letter for each match.
Results are appended to a [Google Sheet](https://docs.google.com/spreadsheets/d/1lGi7mXQZKTbaP4ytTr0F3tcyjkFO4lxDfTMcdpb-8E4).

---

## Prerequisites

- **Docker Desktop** (Windows): https://www.docker.com/products/docker-desktop/
- **llama.cpp server** running locally on port 8080 with a Qwen3.5 model loaded
- **Apify account** + API token: https://console.apify.com/account/integrations
- **Google Sheets** account with OAuth2 credentials enabled

---

## Setup

### 1. Configure Environment Variables

Copy the `.env.example` template to `.env` and fill in your credentials:

```bash
copy .env.example .env
```

Edit `.env` and set:

```
N8N_ENCRYPTION_KEY   — any random 32-character string (e.g., 16 uppercase + 16 lowercase letters)
APIFY_API_TOKEN      — from your Apify account (https://console.apify.com/account/integrations)
LLAMA_CPP_URL        — default to http://host.docker.internal:8080 if llama.cpp runs on port 8080
```

**Generating a random encryption key** (PowerShell):
```powershell
-join ((65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
```

### 2. Start llama.cpp

Make sure your llama.cpp server is running on port 8080. The workflow uses the model:
`unsloth/Qwen3.5-9B-GGUF:Q6_K`

Test the connection:
```powershell
curl http://localhost:8080/health
```
Expected response: `{"status":"ok"}`

### 3. Start n8n

Double-click `start.bat` or run:
```bash
docker compose up -d
```

### 4. Import the Workflow

1. Open http://localhost:5678
2. Create an account (local only, no internet needed)
3. Top-left menu → Workflows → Import from file → select `NL Jobs Unified Automation.json`
4. Toggle the workflow to **Active**

> **Note**: The workflow uses embedded credentials for Google Sheets. If you need to change the sheet or credentials, edit the "Get Existing Jobs" and "Append To Google Sheet" nodes directly in the n8n UI.

---

## Output

Every weekday at **8AM IST**, the workflow:

1. Scrapes **5 LinkedIn job searches** in Netherlands posted in last 24h
2. Filters for visa/relocation sponsorship via local LLM
3. Generates a tailored cover letter for each match
4. Appends rows to **Google Sheet**

### Google Sheet Columns

| Column | Description |
|--------|-------------|
| Date | Application date (YYYY-MM-DD) |
| Company | Job company name |
| Role | Job title/position |
| Location | Job location in Netherlands |
| URL | LinkedIn job posting URL |
| Relocation Reason | Why the candidate wants to relocate |
| Confidence | Relocation signal confidence level |
| Cover Letter | Generated cover letter text |
| Status | Current status (default: "Not Applied") |

---

## Adjusting Search Keywords

Edit the **`Scrape LinkedIn Jobs`** node in the workflow:

1. Open http://localhost:5678
2. Go to Workflows → "NL Jobs - Full Automation"
3. Click the **Scrape LinkedIn Jobs** node
4. Edit the JSON body → `urls` array

Current searches:
- software engineer visa sponsorship Netherlands
- frontend engineer relocation Netherlands
- react developer kennismigrant Netherlands
- AI engineer visa sponsor Netherlands
- fullstack developer sponsorship Netherlands

---

## NPM Scripts

Run `npm install` to install dependencies. Available scripts:

- `npm run inject-code` — Injects custom code from `scripts/` into the workflow (generates `NL Jobs Unified Automation.json`)

---

## Stopping

- Double-click `stop.bat`, or
- Run `docker compose down` in this folder

---

## Troubleshooting

### n8n won't start — llama.cpp healthcheck failing

Make sure llama.cpp is running **before** you run `start.bat`.

Test: `curl http://localhost:8080/health` should return `{"status":"ok"}`

### Workflow runs but Google Sheet is empty

1. Check workflow execution logs in n8n (left sidebar → Executions)
2. LLM may be returning malformed JSON — try lowering temperature or check model
3. Verify Google Sheets OAuth credentials are connected in the workflow node

### Google Sheets not updating

1. Verify the workflow node "Append To Google Sheet" has valid OAuth credentials
2. Check permissions: the sheet must allow edit access from your n8n account
3. Try re-authorizing: Settings → Credentials → Re-authenticate

---

## Files

| File | Purpose |
|------|---------|
| `start.bat` | Starts Docker containers and n8n |
| `stop.bat` | Stops Docker containers |
| `docker-compose.yml` | Docker configuration with healthchecks |
| `NL Jobs Unified Automation.json` | n8n automation workflow (use this one - pre-injected with code) |
| `NL Jobs Readable Automation.json` | Readable workflow version (uses filePath references) |
| `prompts/master-resume.json` | Resume template for cover letter generation (Shirsak Sahoo) |
| `scripts/` | Custom node scripts (normalize-jobs.js, filter-duplicates.js, etc.) |
| `inject-code-to-unified.js` | Transforms Readable to Unified workflow by injecting script code |
| `assemble-row.js` | Assembles job data into Google Sheets row format |
| `build-relocation-request.js` | Builds LLM payload for relocation analysis |
| `build-cover-letter-request.js` | Builds LLM payload for cover letter generation |
| `filter-duplicates.js` | Filters duplicate job URLs from existing sheet |
| `normalize-jobs.js` | Normalizes and cleans LinkedIn job data |
