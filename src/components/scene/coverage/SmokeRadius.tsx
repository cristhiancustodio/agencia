import { DoubleSide } from "three";
import { coverageSettings } from "@/data/agencia-demo";
import { toTuple } from "@/lib/geometry";
import { deviceStyles } from "@/lib/deviceStyles";
import type { Device } from "@/types";

export default function SmokeRadius({ device }: { device: Device }) {
  return (
    <mesh position={toTuple(device.posicion)} rotation-x={-Math.PI / 2} raycast={() => null}>
      <circleGeometry args={[coverageSettings.humo.radio, 64]} />
      <meshBasicMaterial color={deviceStyles.humo.color} side={DoubleSide} transparent opacity={coverageSettings.humo.opacidad} depthWrite={false} />
    </mesh>
  );
}
