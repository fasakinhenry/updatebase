const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

export type WaitlistRole = "organization" | "member";

export async function joinWaitlist(email: string, role: WaitlistRole) {
  const response = await fetch(`${API_URL}/api/waitlist`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, role }),
  });

  const data = (await response.json()) as { error?: string };

  if (!response.ok) {
    throw new Error(data.error ?? "something went wrong, please try again");
  }

  return data;
}
