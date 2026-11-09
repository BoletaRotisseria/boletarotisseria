export function ownsOrder(email: unknown, order: { email?: unknown; customer?: { email?: unknown } }): boolean {
  if (typeof email !== "string" || !email.trim()) return false;
  const normalized = email.trim().toLowerCase();
  // Use the order's recorded email; never accept a caller-supplied customer ID.
  return typeof order.email === "string" && order.email.trim().toLowerCase() === normalized;
}

export function recordedDelivery(attributes: Array<{ name: string; value: string }>) {
  const date = attributes.find(a => a.name === "Data de Entrega/Retirada")?.value ?? "";
  const time = attributes.find(a => a.name === "Horário de Entrega/Retirada")?.value ?? "";
  const match = date.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  const hour = time.match(/^(\d{1,2})(?:h|:)(\d{2})?/);
  if (!match || !hour) return null;
  const iso = `${match[3]}-${match[2]}-${match[1]}`;
  const parsed = new Date(`${iso}T12:00:00Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== iso) return null;
  const h = Number(hour[1]), m = Number(hour[2] ?? "0");
  if (h > 23 || m > 59) return null;
  return { date: iso, time: `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}` };
}

export function isServiceCredential(header: string | null, key: string | undefined): boolean {
  if (!key || !header?.startsWith("Bearer ")) return false;
  const supplied = header.slice(7);
  if (supplied.length !== key.length) return false;
  let diff = 0;
  for (let i = 0; i < key.length; i++) diff |= supplied.charCodeAt(i) ^ key.charCodeAt(i);
  return diff === 0;
}