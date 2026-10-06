import { deviceVisuals } from "@/data/agencia-demo";

export default function CameraIcon({ color }: { color: string }) {
  const shape = deviceVisuals.camara;
  return (
    <group>
      <mesh castShadow><boxGeometry args={shape.cuerpo} /><meshStandardMaterial color={color} roughness={0.45} toneMapped={false} /></mesh>
      <mesh position-z={shape.lenteZ} rotation-x={Math.PI / 2}>
        <cylinderGeometry args={[shape.lenteRadio, shape.lenteRadio, shape.lenteLargo, 16]} />
        <meshStandardMaterial color="#152939" metalness={0.35} roughness={0.2} />
      </mesh>
    </group>
  );
}
