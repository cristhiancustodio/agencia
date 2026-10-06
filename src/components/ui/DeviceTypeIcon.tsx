import { Camera, Radio, Cloud, DoorClosed, CircleAlert } from "lucide-react";
import type { DeviceType } from "@/types";

const icons = { camara: Camera, pir: Radio, humo: Cloud, contacto: DoorClosed, pulsador: CircleAlert };
export default function DeviceTypeIcon({ type, size = 16 }: { type: DeviceType; size?: number }) {
  const Icon = icons[type];
  return <Icon size={size} strokeWidth={1.6} aria-hidden="true" />;
}
