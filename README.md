# Bald Man Bot
A custom Discord bot for the Hard Carry Club, built with Bun, Dressed, and TypeScript.

## Development
It should be as easy as opening a new Codespace on GitHub. It's also setup as a dev container so if you have VS Code locally you should be able to open it in a dev container there.

Before using Codespaces, you should ensure you review the [Codespaces billing documentation](https://docs.github.com/en/billing/managing-billing-for-your-products/about-billing-for-github-codespaces) to ensure you understand how usage is billed.

If you don't want to use Codespaces then using [Dev Containers](https://code.visualstudio.com/docs/devcontainers/containers#_installation) is your best option however you will need the following installed locally:
- Docker Desktop
- VSCode
- [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) VSCode extensions

### Setting Up
The dev container, either locally or in Codespaces, should take care of installing Bun as well as all the recommended extensions to make development easier for you which includes:
- SQLite viewer so you can double click `db.sqlite` and view the database
- Copilot (if you use it)
- Biome for automatic formatting and linting
- as well as some icons, spell check, and inline error viewing

It should also run a setup script that takes care of creating a `.env` file and installing dependencies. If you need to run the setup manually, or if the setup script fails, run the following for a basic install:
```sh
bun install && bun run lefthook install
```

If you notice any issues or after you pull down new changes, you should always run:
```sh
bun install
```

It's highly recommended to test in your own server with just you and the bot as well as a channel for user notes and 2 roles for staff and banned users as well. 

You will also need to create a new [Discord application](https://discord.com/developers/applications) for running the bot.

### Environment File
```env
DISCORD_TOKEN="bot token"
DISCORD_APP_ID="app id"
DISCORD_PUBLIC_KEY="public key"

GUILD_ID="your dev guild"
PUG_BANNED_ROLE_ID="role id"
PUG_STAFF_ROLE_ID="role id"
PUG_NOTES_CHANNEL_ID="channel id"
```

### Running the Bot
You should always register the commands first:
```sh
bun run bot:register-commands
```

If you add new commands or change any of their configuration, you must rerun the command above. When you're ready to start the bot just run:
```sh
bun run dev
```

You will also need to [forward a port](https://code.visualstudio.com/docs/debugtest/port-forwarding). You must change the visibility by right-clicking on the port and selecting **Port Visibility > Public**. Public ports don't require sign-in, which is required for Discord to work. Copy the URL and put it in the `Interactions Endpoint URL` in your new application configuration. Your bot *must* be running for this to save, as Discord will test the endpoint to ensure it works.

### Dressed
To keep things simple, this project uses [Dressed](https://github.com/Inbestigator/dressed). You can see the [Dressed documentation](https://dressed.builders) for more information on how to use it.

The best resource, in my opinion, is the [examples repo](https://github.com/Inbestigator/dressed-examples/tree/main/node)

### Assets
If you want to include images, it's highly recommended to upload them to something like [Imgur](https://imgur.com/), if you worry about it disappearing then contact me in Discord and I'll throw it on the HCC CDN.

### Formatting
I created a new package called [`discord-fmt`](https://www.npmjs.com/package/discord-fmt) for formatting.

As an example of how to use it:
```typescript
import { bold, h1 } from "discord-fmt"

sendMessage(bold("this is bold")) // **this is bold**
sendMessage(h1("Header")) // # Header
sendMessage(bold("sh*t")) // **sh\*t**
```

### Components V2
They're spicy and fun to use. You can use [this site](https://discord.builders/dressed-typescript-code-generator) to get an idea.

### Formatting & Linting
We use Biome for formatting and linting. Lefthook is configured to automatically run the formatter and linter on commit. Your editor should also be configured to format on save if you have the recommended extensions installed.