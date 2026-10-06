import { roomLabelPositions, sceneConfig } from "@/data/agencia-demo";
import { toTuple } from "@/lib/geometry";
import type { Room } from "@/types";
import SceneLabel from "./SceneLabel";

export default function RoomLabel({ room }: { room: Room }) {
  const position = roomLabelPositions[room.id] ?? {
    x: room.x + room.ancho / 2,
    y: sceneConfig.etiquetas.altura,
    z: room.z + room.fondo / 2,
  };
  return (
    <SceneLabel position={toTuple(position)}>
      <div className={`room-label${room.restringido ? " room-label-restricted" : ""}`}>
        {room.nombre}
      </div>
    </SceneLabel>
  );
}
