import { Edges } from "@react-three/drei";
import { agency, sceneConfig } from "@/data/agencia-demo";
import { buildWallPieces } from "@/lib/geometry";
import type { WallMode, WallSegment } from "@/types";

export default function Wall({ wall, mode }: { wall: WallSegment; mode: WallMode }) {
  const type = wall.tipo ?? "muro";
  const profile = agency.perfilesMuros[type];
  const limit = mode === "recortada" ? sceneConfig.alturaRecortada : agency.alturaMuros;
  const height = Math.max(0, Math.min(profile.base + profile.altura, limit) - profile.base);
  const pieces = buildWallPieces(
    wall, profile.base, height, sceneConfig.grosorMuros, sceneConfig.alturaPuertas,
  );
  const isGlass = type === "vidrio";

  return (
    <group name={wall.id}>
      {pieces.map((piece) => (
        <mesh
          key={piece.id}
          position={piece.posicion}
          rotation-y={piece.rotacionY}
          castShadow={!isGlass}
          receiveShadow={!isGlass}
        >
          <boxGeometry args={piece.dimensiones} />
          <meshStandardMaterial
            color={sceneConfig.colores[type]}
            roughness={isGlass ? 0.18 : 0.85}
            metalness={isGlass ? 0.15 : 0}
            transparent={isGlass}
            opacity={isGlass ? 0.32 : 1}
            depthWrite={!isGlass}
          />
          <Edges color={sceneConfig.colores.borde} transparent opacity={isGlass ? 0.3 : 0.55} />
        </mesh>
      ))}
    </group>
  );
}
