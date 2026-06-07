import { api } from "@/lib/api";

export async function sendChatMessage(message: string): Promise<string> {
  const res = await api<string>("/chatBot", {
    method: "POST",
    auth: true,
    body: JSON.stringify({ message }),
  });
  return res;
}