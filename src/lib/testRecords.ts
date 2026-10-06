import type { Device, TestRecord } from "@/types";

export function sanitizeRecords(value: unknown, allowedIds: string[]): Record<string, TestRecord> {
  if (!value || typeof value !== "object") return {};
  const valid: Record<string, TestRecord> = {};
  for (const [id, record] of Object.entries(value)) {
    if (!allowedIds.includes(id) || !record || typeof record !== "object") continue;
    if (!("estado" in record) || typeof record.estado !== "string" || !["pendiente", "ok", "falla"].includes(record.estado)) continue;
    valid[id] = {
      estado: record.estado as TestRecord["estado"],
      fecha: "fecha" in record && typeof record.fecha === "string" && Number.isFinite(Date.parse(record.fecha)) ? record.fecha : undefined,
      observacion: "observacion" in record && typeof record.observacion === "string" ? record.observacion.slice(0, 2000) : undefined,
    };
  }
  return valid;
}

export function summarizeTests(devices: Pick<Device, "id">[], records: Record<string, TestRecord>) {
  const counts = { ok: 0, falla: 0, pendiente: 0 };
  for (const device of devices) counts[records[device.id]?.estado ?? "pendiente"]++;
  const completed = counts.ok + counts.falla;
  return { ...counts, completed, total: devices.length, percentage: devices.length ? Math.round(completed / devices.length * 100) : 0 };
}
