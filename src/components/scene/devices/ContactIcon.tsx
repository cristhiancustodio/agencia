import { deviceVisuals } from "@/data/agencia-demo";

export default function ContactIcon({ color }: { color: string }) {
  const shape = deviceVisuals.contacto;
  return (
    <group>
      {[-1, 1].map((side) => (
        <mesh key={side} position-x={side * shape.separacion} castShadow>
          <boxGeometry args={shape.caja} /><meshStandardMaterial color={color} roughness={0.45} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}
