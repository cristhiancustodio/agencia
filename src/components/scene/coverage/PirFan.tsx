import { useEffect, useMemo } from "react";
import { BufferGeometry, DoubleSide, Float32BufferAttribute } from "three";
import { coverageSettings, rooms } from "@/data/agencia-demo";
import { pirFootprint } from "@/lib/coverage";
import { deviceStyles } from "@/lib/deviceStyles";
import type { Device } from "@/types";

export default function PirFan({ device }: { device: Device }) {
  const geometry = useMemo(() => {
    const room = rooms.find((room) => room.id === device.ambienteId);
    const shape = new BufferGeometry();
    if (!room || !device.objetivo) return shape;
    const config = coverageSettings.pir;
    const polygon = pirFootprint(device.posicion, device.objetivo, room, config.alcance, config.angulo, config.segmentos);
    const vertices: number[] = [];
    for (let i = 1; i < polygon.length - 1; i++) {
      for (const point of [polygon[0], polygon[i], polygon[i + 1]]) vertices.push(point.x, config.altura, point.z);
    }
    shape.setAttribute("position", new Float32BufferAttribute(vertices, 3));
    shape.computeVertexNormals();
    return shape;
  }, [device]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return <mesh geometry={geometry} raycast={() => null}><meshBasicMaterial color={deviceStyles.pir.color} side={DoubleSide} transparent opacity={coverageSettings.pir.opacidad} depthWrite={false} /></mesh>;
}
