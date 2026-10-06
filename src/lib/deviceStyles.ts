import type { DeviceType, TestStatus } from "@/types";

export const deviceStyles: Record<
  DeviceType,
  { nombre: string; color: string; forma: string }
> = {
  camara: { nombre: "Cámara", color: "#3B82F6", forma: "Caja con lente cilíndrico orientado al objetivo" },
  pir: { nombre: "Sensor PIR", color: "#A855F7", forma: "Media esfera o domo en la esquina" },
  humo: { nombre: "Detector de humo", color: "#E5E7EB", forma: "Cilindro plano en el techo" },
  contacto: { nombre: "Contacto magnético", color: "#F59E0B", forma: "Dos cajas paralelas en el marco" },
  pulsador: { nombre: "Pulsador de pánico", color: "#EF4444", forma: "Cilindro corto con botón" },
};

/** Estos estados colorearán el anillo indicador cuando se implemente. */
export const testStatusStyles: Record<
  TestStatus,
  { nombre: string; color: string; pulso: boolean }
> = {
  pendiente: { nombre: "Pendiente", color: "#9CA3AF", pulso: false },
  ok: { nombre: "OK", color: "#22C55E", pulso: false },
  falla: { nombre: "Falla", color: "#EF4444", pulso: true },
};
