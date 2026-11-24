import { afterEach, describe, expect, it, vi } from "vitest";
import { CAPA_NATAL_VOLTA_EM, capaNatalAtiva } from "@/lib/capaNatal";

afterEach(() => {
  vi.useRealTimers();
});

describe("capa de Natal", () => {
  it("continua no ar na véspera da data de volta", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-12-25T12:00:00-03:00"));
    expect(capaNatalAtiva()).toBe(true);
  });

  it("sai do ar na data de volta e a capa original reassume", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(CAPA_NATAL_VOLTA_EM));
    expect(capaNatalAtiva()).toBe(false);
  });

  it("sai do ar depois da data de volta", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2027-01-10T09:00:00-03:00"));
    expect(capaNatalAtiva()).toBe(false);
  });
});
