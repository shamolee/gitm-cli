# gitm-cli (TypeScript)

A cross-platform command-line tool to manage multiple Git accounts (identities) easily.

## Features
- **Multiple Accounts**: Manage separate profiles for Work, Personal, etc.
- **SSH & PAT Support**: Automatically handles SSH keys and Personal Access Tokens.
- **Secure PAT**: Forces HTTPS and injects authentication headers for PAT accounts, disabling SSH fallback.
- **Cross-Platform**: Works on Windows, macOS, and Linux.

## Installation

### Prerequisites
- Node.js (v18+)
- Git

### Install Globally
You can install the tool globally from the source directory:

```bash
cd gitm-cli
npm install -g .
```

Or if/when published to npm:
```bash
npm install -g gitm-cli
```

## Usage

### 1. Add an Account
Register a new identity. Supports **SSH** (keys) and **PAT** (Personal Access Tokens).

```bash
gitm acnt-add
```
Follow the interactive prompts.

### 2. List Accounts
See all registered accounts. The active account is marked with `*`.

```bash
gitm list
```

### 3. Switch Account
Switch the active identity.

```bash
gitm use <alias>
```
Example: `gitm use work`

### 4. Remove an Account
Remove a registered identity.

```bash
gitm acnt-rm <alias>
```

### 5. Running Git Commands
Use `gitm` exactly like `git`. It wraps the standard git command and injects the correct configuration based on your active profile.

```bash
gitm push origin main
gitm clone <url>
gitm commit -m "msg"
```

## Configuration
Configuration is stored in `~/.gitmconfig` (JSON format).

## Development
1. Install dependencies: `npm install`
2. Build: `npm run build`
3. Link globally for testing: `npm link`
