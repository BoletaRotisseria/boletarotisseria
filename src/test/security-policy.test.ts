import { describe, expect, it } from "vitest";
import { ownsOrder, recordedDelivery, isServiceCredential } from "../../supabase/functions/_shared/security-policy";
import { createOAuthState, verifyOAuthState } from "../../supabase/functions/_shared/oauth-state";

describe("Order authorization", () => {
  it("allows only the recorded order email", () => {
    expect(ownsOrder("owner@example.test", { email: "OWNER@example.test" })).toBe(true);
    expect(ownsOrder("attacker@example.test", { email: "owner@example.test" })).toBe(false);
    expect(ownsOrder("", { email: "" })).toBe(false);
  });
  it("uses recorded dates and the start of the recorded window", () => {
    expect(recordedDelivery([
      { name: "Data de Entrega/Retirada", value: "28/10/2026" },
      { name: "Horário de Entrega/Retirada", value: "11h às 13h" },
    ])).toEqual({ date: "2026-10-28", time: "11:00" });
    expect(recordedDelivery([
      { name: "Data de Entrega/Retirada", value: "31/02/2026" },
      { name: "Horário de Entrega/Retirada", value: "11h às 13h" },
    ])).toBeNull();
  });
});

describe("Internal synchronization", () => {
  it("rejects absent, anonymous and forged service credentials", () => {
    expect(isServiceCredential(null, "test-service-key")).toBe(false);
    expect(isServiceCredential("Bearer anon", "test-service-key")).toBe(false);
    expect(isServiceCredential("Bearer test-service-kex", "test-service-key")).toBe(false);
    expect(isServiceCredential("Bearer test-service-key", "test-service-key")).toBe(true);
  });
});

describe("Bling OAuth state", () => {
  it("accepts signed states and rejects tampering, wrong secrets and expiration", async () => {
    const now = 1_800_000_000_000;
    const state = await createOAuthState("admin-id", "test-secret", now);
    expect(await verifyOAuthState(state, "test-secret", now)).toBe("admin-id");
    expect(await verifyOAuthState(state + "x", "test-secret", now)).toBeNull();
    expect(await verifyOAuthState(state, "wrong-secret", now)).toBeNull();
    expect(await verifyOAuthState(state, "test-secret", now + 600_000)).toBeNull();
    expect(await verifyOAuthState("", "test-secret", now)).toBeNull();
  });
});