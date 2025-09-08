# Bald Man Bot

A custom Discord bot for the Hard Carry Club, built with Bun, Dressed, and TypeScript.

## Quick Start

### Prerequisites

You'll need one of the following development environments:

**Option 1: GitHub Codespaces (Recommended)**

- No local setup required
- Review the [Codespaces billing documentation](https://docs.github.com/en/billing/managing-billing-for-your-products/about-billing-for-github-codespaces) first

**Option 2: Local Dev Containers**

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [VS Code](https://code.visualstudio.com/)
- [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

### Discord Application Setup

1. Create a new [Discord application](https://discord.com/developers/applications)
2. Copy the bot token (from the bot section), application ID, and public key
3. Set up a test Discord server with:
   - A channel for user notes
   - A role for staff members
   - A role for banned users

## Development Setup

### Environment Configuration

It should be automatically created but you should have a `.env` that looks similar to this:

```env
DISCORD_TOKEN="your_bot_token_here"

GUILD_ID="your_test_server_id"
PUG_BANNED_ROLE_ID="banned_role_id"
PUG_STAFF_ROLE_ID="staff_role_id"
PUG_NOTES_CHANNEL_ID="notes_channel_id"
```

### Installation

The dev container should automatically run setup, but if needed, run manually:

```sh
bun install && bun run lefthook install
```

After pulling new changes, always run:

```sh
bun install
```

### Running the Bot

1. **Register Discord commands** (required for new/changed commands):

   ```sh
   bun run bot:register-commands
   ```

2. **Start the development server**:

   ```sh
   bun run dev
   ```

3. **Configure Discord webhook** (one-time setup):
   - [Forward port](https://code.visualstudio.com/docs/debugtest/port-forwarding) in VS Code
   - Right-click the port → **Port Visibility** → **Public**
   - Copy the public URL
   - Paste into `Interactions Endpoint URL` in your Discord application settings
   - **Note**: The bot must be running when you save this setting as Discord will validate it's working correctly

## Committing Code

When making commits you should always follow [conventional commit](https://www.conventionalcommits.org/en/v1.0.0/#summary) format. If you wanna quick cheat sheet [checkout this post](https://gist.github.com/Zekfad/f51cb06ac76e2457f11c80ed705c95a3). There will be a check automatically ran as you stage and commit code to GitHub to ensure it follows this format.

If you use Copilot you can autogenerate a commit and it should follow this standard as well.

## Development Tools

### Included Extensions

The dev container includes these helpful extensions:

- **SQLite Viewer** - Double-click `db.sqlite` to view the database
- **GitHub Copilot** - AI code assistance (if you have access)
- **Biome** - Automatic formatting and linting
- **Additional**: Icons, spell check, and inline error viewing

### Frameworks & Libraries

**Dressed Framework**

- [Documentation](https://dressed.vercel.app/docs)
- [Examples Repository](https://github.com/Inbestigator/dressed-examples/)
- [Code Generator](https://discord.builders/dressed-typescript-code-generator)

**Discord Formatting**

- Uses [`discord-fmt`](https://www.npmjs.com/package/discord-fmt) package
- Example usage:

  ```typescript
  import { bold, h1 } from "discord-fmt";

  sendMessage(bold("this is bold")); // **this is bold**
  sendMessage(h1("Header")); // # Header
  sendMessage(bold("sh*t")); // **sh\*t**
  ```

### Code Quality

**Formatting & Linting**

- **Biome** handles formatting and linting
- **Lefthook** runs checks automatically on commit
- Format on save enabled if you're using Codespaces or VSCode

## Assets & Resources

If you want to include images, it's highly recommended to upload them to something like [Imgur](https://imgur.com), if you worry about it disappearing then contact me in Discord and I'll throw it on the HCC CDN.

## Troubleshooting

**Common Issues:**

- **Commands not updating**: Run `bun run bot:register-commands` after changes
- **Webhook errors**: Ensure port is public and bot is running when configuring Discord
- **Permission errors**: Check bot permissions in your test server
- **Environment issues**: Verify all required environment variables are set
