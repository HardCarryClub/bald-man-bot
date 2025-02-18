import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { verifyKey } from "./utilities/verification";
import {
  APP_ID,
  GUILD_ID,
  IS_IN_DEV,
  PUBLIC_KEY,
  PUG_BANNED_ROLE_ID,
} from "./utilities/env";
import {
  InteractionResponseType,
  InteractionType,
  MessageFlags,
  type APIApplicationCommandInteractionDataSubcommandOption,
  type APIApplicationCommandInteractionDataUserOption,
  type APIChatInputApplicationCommandGuildInteraction,
} from "discord-api-types/v10";
import { commandMap } from "./utilities/commands";
import { sendRequestToDiscord } from "./utilities/discord";
import pugManage from "./commands/pugManage";

const app = new Hono();

app.get("/", (c) => {
  return c.text("boop");
});

app.all("/interaction", async (c) => {
  if (c.req.method !== "POST") {
    throw new HTTPException(405, { message: "Method Not Allowed" });
  }

  const signature = c.req.header("x-signature-ed25519");
  const timestamp = c.req.header("x-signature-timestamp");
  const interaction = await c.req.json();

  if (!signature || !timestamp) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }

  const verified = await verifyKey(
    await c.req.text(),
    signature ?? "",
    timestamp ?? "",
    PUBLIC_KEY ?? "",
  );

  if (!verified) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }

  if (IS_IN_DEV) {
    // console.log(interaction);
  }

  if (interaction.type === InteractionType.Ping) {
    return c.json({
      type: InteractionResponseType.Pong,
    });
  }

  if (interaction.type === InteractionType.ApplicationCommand) {
    const {
      data: { name, options },
      guild,
      token,
    } = interaction as APIChatInputApplicationCommandGuildInteraction;

    const command = commandMap[name];

    if (!command) {
      return c.json({});
    }

    if (guild?.id !== GUILD_ID) {
      return c.json({});
    }

    switch (name) {
      case "reload-commands": {
        const commands = [];

        for (const [key, value] of Object.entries(commandMap)) {
          const { ...rest } = value;
          commands.push({
            name: key,
            ...rest,
          });
        }

        await sendRequestToDiscord(
          `applications/${APP_ID}/guilds/${GUILD_ID}/commands`,
          "PUT",
          commands,
        );

        return c.json({
          type: InteractionResponseType.ChannelMessageWithSource,
          data: {
            content: "Reloading commands...",
            flags: MessageFlags.Ephemeral,
          },
        });
      }

      case "pug-ban": {
        const user: APIApplicationCommandInteractionDataUserOption | undefined =
          options?.find(
            (option) => option.name === "user",
          ) as APIApplicationCommandInteractionDataUserOption;

        if (!user) {
          return c.json({
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
              content: "You need to specify a user to ban!",
              flags: MessageFlags.Ephemeral,
            },
          });
        }

        sendRequestToDiscord(
          `/guilds/${GUILD_ID}/members/${user.value}/roles/${PUG_BANNED_ROLE_ID}`,
          "PUT",
        ).then((data) => {
          return sendRequestToDiscord(
            `/webhooks/${APP_ID}/${token}/messages/@original`,
            "PATCH",
            {
              content: `✅ Successfully applied the PUG banned role to <@${user.value}>.`,
              flags: MessageFlags.Ephemeral,
            },
          );
        });

        return c.json({
          type: InteractionResponseType.DeferredChannelMessageWithSource,
          data: {
            flags: MessageFlags.Ephemeral,
          },
        });
      }

      case "pug-manage": {
        pugManage(
          token,
          name,
          options as APIApplicationCommandInteractionDataSubcommandOption[],
        ).catch((e) => {
          console.error(e);

          return sendRequestToDiscord(
            `/webhooks/${APP_ID}/${token}/messages/@original`,
            "PATCH",
            {
              content: `❌ An error occurred: ${e.message}`,
            },
          );
        });

        return c.json({
          type: InteractionResponseType.DeferredChannelMessageWithSource,
          data: {
            // flags: MessageFlags.Ephemeral,
          },
        });
      }

      default:
        return c.json({});
    }
  }

  return c.json({});
});

const port = 3000;
console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
