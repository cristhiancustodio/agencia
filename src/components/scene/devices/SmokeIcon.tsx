import { deviceVisuals } from "@/data/agencia-demo";

export default function SmokeIcon({ color }: { color: string }) {
  const shape = deviceVisuals.humo;
  return (
    <group>
      <mesh castShadow><cylinderGeometry args={[shape.radio, shape.radio, shape.alto, 24]} /><meshStandardMaterial color={color} roughness={0.8} /></mesh>
      <mesh><cylinderGeometry args={[shape.centroRadio, shape.centroRadio, shape.alto * 1.2, 20]} /><meshStandardMaterial color="#73828d" /></mesh>
    </group>
  );
}
