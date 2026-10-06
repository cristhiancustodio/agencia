import { deviceVisuals } from "@/data/agencia-demo";

export default function PirIcon({ color }: { color: string }) {
  return (
    <mesh rotation-x={Math.PI / 2} castShadow>
      <sphereGeometry args={[deviceVisuals.pir.radio, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <meshStandardMaterial color={color} roughness={0.45} toneMapped={false} />
    </mesh>
  );
}
