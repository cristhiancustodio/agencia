import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useCursor } from "@react-three/drei";
import { DoubleSide, type Mesh, type MeshStandardMaterial } from "three";
import { deviceVisuals } from "@/data/agencia-demo";
import { deviceStyles, testStatusStyles } from "@/lib/deviceStyles";
import { toTuple } from "@/lib/geometry";
import { lookAtTarget } from "@/lib/orientation";
import { useSecurityStore } from "@/store/useSecurityStore";
import { useReducedMotion } from "@/lib/useReducedMotion";
import type { Device } from "@/types";
import SceneLabel from "../SceneLabel";
import CameraIcon from "./CameraIcon";
import PirIcon from "./PirIcon";
import SmokeIcon from "./SmokeIcon";
import ContactIcon from "./ContactIcon";
import PanicIcon from "./PanicIcon";

const icons = { camara: CameraIcon, pir: PirIcon, humo: SmokeIcon, contacto: ContactIcon, pulsador: PanicIcon };

export default function DeviceMarker({ device }: { device: Device }) {
  const [hovered, setHovered] = useState(false);
  const selected = useSecurityStore((state) => state.selectedId === device.id);
  const selectDevice = useSecurityStore((state) => state.selectDevice);
  const status = useSecurityStore((state) => state.records[device.id]?.estado ?? "pendiente");
  const ring = useRef<Mesh>(null);
  const material = useRef<MeshStandardMaterial>(null);
  const reducedMotion = useReducedMotion();
  useFrame(({ clock, invalidate }) => {
    if (status !== "falla" || reducedMotion) return;
    const pulse = Math.sin(clock.getElapsedTime() * 4);
    ring.current?.scale.setScalar(1 + (pulse + 1) * 0.1);
    if (material.current) material.current.emissiveIntensity = 5.5 + pulse;
    invalidate();
  });
  useCursor(hovered);
  const orientation = useMemo(() => lookAtTarget(device.posicion, device.objetivo), [device]);
  const Icon = icons[device.tipo];
  const { anillo } = deviceVisuals;

  return (
    <group name={device.id} position={toTuple(device.posicion)}
      onPointerOver={(event) => { event.stopPropagation(); setHovered(true); }}
      onPointerOut={() => setHovered(false)}
      onClick={(event) => { event.stopPropagation(); selectDevice(device.id); }}
      scale={hovered || selected ? 1.3 : 1}
    >
      <group quaternion={orientation}><Icon color={deviceStyles[device.tipo].color} /></group>
      <mesh key={`${status}-${reducedMotion}`} ref={ring} rotation-x={-Math.PI / 2} position-y={anillo.offsetY} scale={1}>
        <ringGeometry args={[anillo.interior, anillo.exterior, 32]} />
        <meshStandardMaterial ref={material} color={testStatusStyles[status].color} emissive={testStatusStyles[status].color} emissiveIntensity={status === "falla" ? 5.5 : 0.4} toneMapped={status !== "falla"} side={DoubleSide} />
      </mesh>
      {selected && <mesh rotation-x={-Math.PI / 2} position-y={anillo.offsetY}><ringGeometry args={[deviceVisuals.seleccion.interior, deviceVisuals.seleccion.exterior, 40]} /><meshBasicMaterial color="#bce5d1" side={DoubleSide} /></mesh>}
      <mesh><sphereGeometry args={[deviceVisuals.hitRadius, 8, 8]} /><meshBasicMaterial transparent opacity={0} depthWrite={false} /></mesh>
      {(hovered || selected) && <SceneLabel position={[0, deviceVisuals.tooltipOffset, 0]}><span className="device-tooltip"><strong>{device.id}</strong>{device.nombre}</span></SceneLabel>}
    </group>
  );
}
