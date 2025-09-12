import { db } from "@app/db";
import { pugLobbyHostSignup } from "@app/db/schema";
import { logger } from "@app/utilities/logger";
import { PATTERN_BASE } from "@bot/components/buttons/host-signup";
import { type HostSignup, signupComponents } from "@bot/utilities/host-scheduling";
import to from "await-to-js";
import { MessageFlags } from "discord-api-types/v10";
import { editMessage, type MessageComponentInteraction } from "dressed";
import { eq } from "drizzle-orm";

export const pattern = `${PATTERN_BASE}-unavailable`;

export default async function (
  interaction: MessageComponentInteraction,
  args: { id: number; day: string; startTime: number },
) {
  interaction.deferReply({ ephemeral: true });

  const [err, dbResult] = await to(
    db.query.pugLobbyHostSignup.findFirst({
      where: (table, { eq }) => eq(table.id, args.id),
    }),
  );

  if (err) {
    logger.error({ err, args, user: interaction.user.id }, "Error fetching signup record");

    return interaction.editReply({ content: "There was an error fetching the signup record." });
  }

  if (!dbResult) {
    logger.error({ args, user: interaction.user.id }, "No signup record found");
    return interaction.editReply({ content: "No signup record found." });
  }

  const record: HostSignup = {
    id: dbResult.id,
    game: dbResult.game,
    channelId: dbResult.channelId,
    messageId: dbResult.messageId,
    data: JSON.parse(dbResult.data),
  };

  if (!record.channelId || !record.messageId) {
    logger.error({ args, user: interaction.user.id }, "Signup record is missing channelId or messageId");
    return interaction.editReply({ content: "Signup record is missing channelId or messageId." });
  }

  if (!record.data) {
    logger.error({ args, user: interaction.user.id }, "No day found in signup record");
    return interaction.editReply({ content: "No day found in signup record." });
  }

  const block = record.data.blocks.find((blocks) => {
    const startTime = Number(args.startTime);

    return blocks.startTime === startTime;
  });

  if (!block) {
    logger.error({ args, user: interaction.user.id }, "No time block found in signup record");
    return interaction.editReply({ content: "No time block found in signup record." });
  }

  if (block.responses.unavailable.find((entry) => entry.userId === interaction.user.id)) {
    return interaction.editReply({ content: "You have already marked yourself as unavailable for this time block." });
  }

  block.responses.unavailable.push({ userId: interaction.user.id, note: null });
  block.responses.canHost = block.responses.canHost.filter((entry) => entry.userId !== interaction.user.id);
  block.responses.cannotHost = block.responses.cannotHost.filter((entry) => entry.userId !== interaction.user.id);

  const newData = {
    ...record.data,
    blocks: record.data.blocks.map((b) => (b === block ? block : b)),
  };

  const [updateErr] = await to(
    db
      .update(pugLobbyHostSignup)
      .set({ data: JSON.stringify(newData) })
      .where(eq(pugLobbyHostSignup.id, record.id)),
  );

  if (updateErr) {
    logger.error({ updateErr, args, user: interaction.user.id }, "Error updating signup record");

    return interaction.editReply({ content: "There was an error updating the signup record." });
  }

  const components = signupComponents(record);

  if (!components) {
    logger.error({ args, user: interaction.user.id }, "No components generated for signup record");
    return interaction.editReply({ content: "There was an error generating the signup components." });
  }

  const [editErr] = await to(
    editMessage(record.channelId, record.messageId, {
      components,
      flags: MessageFlags.IsComponentsV2,
    }),
  );

  if (editErr) {
    logger.error({ editErr, args, user: interaction.user.id }, "Error editing signup message");
    return interaction.editReply({ content: "There was an error updating the signup message." });
  }

  interaction.editReply({ content: "Your response has been recorded. Thank you!" });
}
