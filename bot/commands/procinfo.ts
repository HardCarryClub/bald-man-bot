import { formatDistanceToNow } from "date-fns";
import { MessageFlags } from "discord-api-types/v10";
import { h1, h2, link } from "discord-fmt";
import { type CommandConfig, type CommandInteraction, Container, TextDisplay } from "dressed";
import * as pkg from "../../package.json";
import { isStaff } from "../utilities/auth";

export const config: CommandConfig = {
  description: "Displays the bot's process info.",
  default_member_permissions: ["Administrator"],
};

export default async function (interaction: CommandInteraction) {
  if (!(await isStaff(interaction.member ?? interaction.user))) {
    await interaction.editReply({
      content: "You do not have permission to use this command.",
    });

    return;
  }

  const mem = process.memoryUsage();
  const uptime = process.uptime();
  const startTime = new Date(Date.now() - uptime * 1000);
  const cpuUsage = process.cpuUsage();
  const rssMB = (mem.rss / 1024 / 1024).toFixed(2);
  const heapMB = (mem.heapUsed / 1024 / 1024).toFixed(2);
  const heapTotalMB = (mem.heapTotal / 1024 / 1024).toFixed(2);
  const externalMB = (mem.external / 1024 / 1024).toFixed(2);
  const cpuUserPercentage = cpuUsage.user.toFixed(0);
  const cpuSystemPercentage = cpuUsage.system.toFixed(0);

  await interaction.reply({
    components: [
      TextDisplay(h1("Process Info")),
      Container(
        TextDisplay(h2("General")),
        TextDisplay(`Uptime: ${formatDistanceToNow(startTime, { addSuffix: true })}`),
      ),
      Container(
        TextDisplay(h2("Memory")),
        TextDisplay(`RSS: ${rssMB} MB`),
        TextDisplay(`Heap: ${heapMB} MB / ${heapTotalMB} MB`),
        TextDisplay(`External: ${externalMB} MB`),
      ),
      Container(
        TextDisplay(h2("CPU Usage")),
        TextDisplay(`User: ${cpuUserPercentage} ms`),
        TextDisplay(`System: ${cpuSystemPercentage} ms`),
      ),
      Container(
        TextDisplay(h2("Versions")),
        TextDisplay(`Bun: ${Bun.version}`),
        TextDisplay(
          `BaldMan Bot: ${link(`v${pkg.version}`, `https://github.com/HardCarryClub/bald-man-bot/releases/tag/v${pkg.version}`)}`,
        ),
      ),
    ],
    flags: MessageFlags.IsComponentsV2,
  });
}
