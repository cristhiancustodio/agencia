import { deviceVisuals } from "@/data/agencia-demo";

export default function PanicIcon({ color }: { color: string }) {
  const shape = deviceVisuals.pulsador;
  return (
    <group>
      <mesh castShadow><cylinderGeometry args={[shape.radio, shape.radio, shape.alto, 20]} /><meshStandardMaterial color="#293e47" /></mesh>
      <mesh position-y={shape.botonY}><cylinderGeometry args={[shape.botonRadio, shape.botonRadio, shape.botonAlto, 20]} /><meshStandardMaterial color={color} toneMapped={false} roughness={0.45} /></mesh>
    </group>
  );
}
