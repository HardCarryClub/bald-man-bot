export function respond(response: unknown, statusCode = 200) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(response),
  };
}

export async function sendRequestToDiscord(
  endpoint: string,
  method: "GET" | "POST" | "PATCH" | "DELETE" | "PUT",
  body?: unknown,
) {
  const response = await fetch(`https://discord.com/api/v10/${endpoint}`, {
    method,
    headers: {
      Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
      "Content-Type": "application/json",
      "User-Agent": "DiscordBot (hardcarry.club, 1.0.0)",
    },
    body: JSON.stringify(body) ?? undefined,
  });

  return response.json();
}
