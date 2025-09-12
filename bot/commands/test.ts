/** biome-ignore-all lint/style/noNonNullAssertion: Testing */
import { db } from "@app/db";
import { pugLobbyHostSignup } from "@app/db/schema";
import { createSignupRecord, type HostSignup, signupComponents } from "@bot/utilities/host-scheduling";
import { MessageFlags } from "discord-api-types/v10";
import { type CommandConfig, type CommandInteraction, createMessage, editMessage, TextDisplay } from "dressed";

export const config: CommandConfig = {
  description: "Test command",
  default_member_permissions: ["Administrator"],
  guilds: ["1018219866081210469"], // Dev Guild ID
};

export default async function (interaction: CommandInteraction) {
  const message = await createMessage(interaction.channel.id, {
    components: [TextDisplay("Setting up host signup...")],
    flags: MessageFlags.IsComponentsV2,
  });

  const record = createSignupRecord("rivals");
  const result = await db
    .insert(pugLobbyHostSignup)
    .values({
      game: "rivals",
      channelId: message.channel_id,
      messageId: message.id,
      data: JSON.stringify(record),
      createdAt: new Date().toISOString(),
      createdBy: interaction.user.id,
    })
    .returning({ id: pugLobbyHostSignup.id });

  const signup: HostSignup = {
    id: result[0]!.id,
    game: "rivals",
    channelId: message.channel_id,
    messageId: message.id,
    data: record!,
  };

  const components = signupComponents(signup);

  if (!components) {
    return interaction.reply({ content: "Failed to generate signup components.", ephemeral: true });
  }

  await editMessage(message.channel_id, message.id, {
    components,
    flags: MessageFlags.IsComponentsV2,
  });

  await interaction.reply({ content: "Host signup setup complete.", ephemeral: true });

  // await interaction.reply({
  //   components: signupComponents(signup) || [],
  //   flags: MessageFlags.IsComponentsV2,
  // });
}
