import { useMemo } from "react";
import { DoubleSide } from "three";
import { coverageSettings } from "@/data/agencia-demo";
import { lookAtTarget } from "@/lib/orientation";
import { toTuple } from "@/lib/geometry";
import { deviceStyles } from "@/lib/deviceStyles";
import type { Device } from "@/types";

export default function CameraCone({ device }: { device: Device }) {
  const orientation = useMemo(() => lookAtTarget(device.posicion, device.objetivo), [device]);
  const settings = coverageSettings.camara;
  const radius = Math.tan(settings.angulo / 2) * settings.alcance;
  return (
    <group position={toTuple(device.posicion)} quaternion={orientation}>
      <mesh position-z={settings.alcance / 2} rotation-x={-Math.PI / 2} raycast={() => null}>
        <coneGeometry args={[radius, settings.alcance, 40, 1, true]} />
        <meshBasicMaterial color={deviceStyles.camara.color} side={DoubleSide} transparent opacity={settings.opacidad} depthWrite={false} />
      </mesh>
    </group>
  );
}
