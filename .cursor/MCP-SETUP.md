# GitHub MCP Setup for Cursor

This project is configured to use the **GitHub MCP (Model Context Protocol) server** so Cursor can control your GitHub account (repos, issues, PRs, branches, etc.).

## 1. Create a GitHub Personal Access Token (PAT)

1. Go to **GitHub** → **Settings** → **Developer settings** → **Personal access tokens** → [Tokens (classic)](https://github.com/settings/tokens) or [Fine-grained tokens](https://github.com/settings/tokens?type=beta).
2. Click **Generate new token**.
3. Give it a name (e.g. `Cursor MCP`).
4. Choose scopes (for full repo control, include at least):
   - **repo** (full control of private repositories)
   - **read:user**, **user:email** (if you need user info)
5. Generate and **copy the token** (you won’t see it again).

## 2. Add the token to Cursor

Open `.cursor/mcp.json` in this project and replace `YOUR_GITHUB_PAT_HERE` with your actual token:

```json
"env": {
  "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxxxxxxxxxxxxxxxxxxx"
}
```

**Security:** Do not commit this file with a real token. Add `.cursor/mcp.json` to `.gitignore` if it contains secrets, or use Cursor’s global MCP config (see below) and keep the token only on your machine.

## 3. Restart Cursor

Close Cursor completely and reopen it (MCP servers load only at startup).

## 4. Verify

In Cursor, ask in chat: **“What MCP tools do you have available?”**  
You should see GitHub-related tools (e.g. create repository, create issue, create pull request, search repositories).

---

## Optional: Use global config instead

To use GitHub MCP in all projects (and keep the token out of this repo):

1. Press **Win + R**, type `%USERPROFILE%\.cursor`, press Enter.
2. Create or edit `mcp.json` in that folder with the same `mcpServers.github` content and your PAT in `env`.
3. Restart Cursor.

Project-level `.cursor/mcp.json` (this repo) overrides the global one when you’re in this workspace.
