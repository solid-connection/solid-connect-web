export const chatKeys = {
  all: ["chat"],
  rooms: (userId: number | null) => ["chat", userId, "rooms"] as const,
  partner: (userId: number | null, roomId: number) => ["chat", userId, "partner", roomId] as const,
  outbox: (userId: number, roomId: number) => ["chat", userId, "outbox", roomId] as const,
} as const;
