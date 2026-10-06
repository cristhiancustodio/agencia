import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { type Group, MathUtils } from "three";
import { sceneConfig } from "@/data/agencia-demo";
import { useReducedMotion } from "@/lib/useReducedMotion";
import FloorPlan from "./FloorPlan";
import DeviceLayer from "./devices/DeviceLayer";
import CoverageLayer from "./coverage/CoverageLayer";

export default function SceneContent() {
  const group = useRef<Group>(null);
  const elapsed = useRef(0);
  const reducedMotion = useReducedMotion();
  const config = sceneConfig.entrada;
  useFrame((state, delta) => {
    if (!group.current || elapsed.current >= config.duracion) return;
    elapsed.current = reducedMotion ? config.duracion : Math.min(elapsed.current + delta, config.duracion);
    const progress = 1 - Math.pow(1 - elapsed.current / config.duracion, 3);
    group.current.scale.setScalar(MathUtils.lerp(config.escalaInicial, 1, progress));
    group.current.position.y = MathUtils.lerp(config.desplazamientoY, 0, progress);
    state.invalidate();
  });
  return <group ref={group}><FloorPlan /><DeviceLayer /><CoverageLayer /></group>;
}
