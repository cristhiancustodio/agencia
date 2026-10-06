import { Edges } from "@react-three/drei";
import { agency, rooms, sceneConfig, tellerWindows, walls } from "@/data/agencia-demo";
import { useSecurityStore } from "@/store/useSecurityStore";
import RoomLabel from "./RoomLabel";
import Wall from "./Wall";
import SceneLabel from "./SceneLabel";

export default function FloorPlan() {
  const wallMode = useSecurityStore((state) => state.wallMode);
  const { base, centro, piso, colores, etiquetas } = sceneConfig;

  return (
    <group name="agencia-demo">
      <mesh position={[centro.x, -base.grosor / 2, centro.z]} receiveShadow castShadow>
        <boxGeometry args={[agency.ancho + base.margen * 2, base.grosor, agency.fondo + base.margen * 2]} />
        <meshStandardMaterial color={colores.base} roughness={0.9} />
        <Edges color={colores.borde} />
      </mesh>

      {rooms.map((room) => (
        <group key={room.id} name={room.id}>
          <mesh
            position={[room.x + room.ancho / 2, piso.altura, room.z + room.fondo / 2]}
            rotation-x={-Math.PI / 2}
            receiveShadow
          >
            <planeGeometry args={[room.ancho - piso.separacion, room.fondo - piso.separacion]} />
            <meshStandardMaterial color={room.color} roughness={0.95} />
          </mesh>
          <RoomLabel room={room} />
        </group>
      ))}

      {walls.map((wall) => <Wall key={wall.id} wall={wall} mode={wallMode} />)}

      {tellerWindows.map((window) => (
        <SceneLabel
          key={window.id}
          position={[window.centro.x, etiquetas.alturaVentanilla, window.centro.z]}
        >
          <span className="window-label" title={window.nombre}>{window.id}</span>
        </SceneLabel>
      ))}
    </group>
  );
}
