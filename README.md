# Bald Man Bot
We want custom commands, so the Bald Man runs custom commands. It's hella scuffed.

## Development
It should be as easy as opening a new Codespace on GitHub. It's also setup as a dev container so if you have VS Code locally you should be able to open it in a dev container there.

Before using Codespaces, you should ensure you review the [Codespaces billing documentation](https://docs.github.com/en/billing/managing-billing-for-your-products/about-billing-for-github-codespaces) to ensure you understand how usage is billed.

DevContainer should automatically install the dependencies and lefthook, but if it doesn't, you can run the following commands:

```bash
pnpm install --frozen-lockfile && pnpm lefthook install
```

It's also recommended to run the following command to ensure everything is setup correctly:

```bash
./setup.sh
```

### Running the Bot
It's highly recommended to test in your own server with just you and the bot. You should setup your own Discord application as well.

### Dressed
To keep things simple, I migrated from using a custom server to using [Dressed](https://github.com/Inbestigator/dressed). You can see the [Dressed documentation](https://dressed.builders) for more information on how to use it.

The best resource, in my opinion, is the [examples repo](https://github.com/Inbestigator/dressed-examples/tree/main/node)

### Assets
If you want to include images, it's highly recommended to upload them to something like [Imgur](https://imgur.com/), if you worry about it disappearing then contact me in Discord and I'll throw it on the HCC CDN.

### Components V2
They're spicy and fun to use. You can use [this site](https://discord.builders/dressed-typescript-code-generator) to get an idea, but the import is wrong. Instead of `@dressed/dressed` you should use `dressed` as the import.

### Formatting & Linting
We use Biome and Lefthook should automatically run the formatters and linters on commit. It should also run all the actions as you save.