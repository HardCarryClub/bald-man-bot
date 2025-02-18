import { commandMap } from "./utilities/commands";
import { sendRequestToDiscord } from "./utilities/discord";
import { APP_ID, GUILD_ID } from "./utilities/env";

const commands = [];

for (const [key, value] of Object.entries(commandMap)) {
  const { ...rest } = value;
  commands.push({
    name: key,
    ...rest,
  });
}

console.log(commands);

sendRequestToDiscord(
  `applications/${APP_ID}/guilds/${GUILD_ID}/commands`,
  "PUT",
  commands,
)
  .then((data) => {
    console.log(JSON.stringify(data));
    console.log("Commands updated");
  })
  .catch(console.error);
