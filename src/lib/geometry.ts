import type { Vec3, WallSegment } from "@/types";

export function toTuple(vector: Vec3): [number, number, number] {
  return [vector.x, vector.y, vector.z];
}

export interface WallPiece {
  id: string;
  posicion: [number, number, number];
  dimensiones: [number, number, number];
  rotacionY: number;
}

/** Divide el muro en paños y dinteles; conserva libres las aberturas. */
export function buildWallPieces(
  wall: WallSegment,
  base: number,
  height: number,
  thickness: number,
  openingHeight: number,
): WallPiece[] {
  const dx = wall.hasta.x - wall.desde.x;
  const dz = wall.hasta.z - wall.desde.z;
  const length = Math.hypot(dx, dz);
  if (length === 0 || height <= 0) return [];

  const pieces: WallPiece[] = [];
  const addPiece = (id: string, start: number, end: number, bottom: number, top: number) => {
    if (end <= start || top <= bottom) return;
    const center = (start + end) / 2;
    pieces.push({
      id: `${wall.id}-${id}`,
      posicion: [
        wall.desde.x + (dx * center) / length,
        (bottom + top) / 2,
        wall.desde.z + (dz * center) / length,
      ],
      dimensiones: [end - start, top - bottom, thickness],
      rotacionY: -Math.atan2(dz, dx),
    });
  };

  let cursor = 0;
  const top = base + height;
  const openings = [...(wall.aberturas ?? [])].sort((a, b) => a.posicion - b.posicion);
  for (const opening of openings) {
    const start = Math.max(cursor, opening.posicion - opening.ancho / 2);
    const end = Math.min(length, opening.posicion + opening.ancho / 2);
    addPiece(`pano-${opening.id}`, cursor, start, base, top);
    addPiece(`dintel-${opening.id}`, start, end, Math.max(base, openingHeight), top);
    cursor = end;
  }
  addPiece("final", cursor, length, base, top);
  return pieces;
}
