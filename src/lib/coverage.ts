import type { PlanPoint, Room } from "@/types";

/** Sutherland–Hodgman: recorte de un polígono convexo contra su ambiente. */
export function clipToRoom(polygon: PlanPoint[], room: Room): PlanPoint[] {
  let result = polygon;
  const boundaries: { axis: "x" | "z"; bound: number; minimum: boolean }[] = [
    { axis: "x", bound: room.x, minimum: true },
    { axis: "x", bound: room.x + room.ancho, minimum: false },
    { axis: "z", bound: room.z, minimum: true },
    { axis: "z", bound: room.z + room.fondo, minimum: false },
  ];
  for (const { axis, bound, minimum } of boundaries) {
    const input = result;
    result = [];
    if (input.length === 0) break;
    const inside = (point: PlanPoint) => minimum ? point[axis] >= bound : point[axis] <= bound;
    let previous = input[input.length - 1];
    for (const current of input) {
      const currentInside = inside(current);
      if (currentInside !== inside(previous)) {
        const t = (bound - previous[axis]) / (current[axis] - previous[axis]);
        result.push({ x: previous.x + t * (current.x - previous.x), z: previous.z + t * (current.z - previous.z) });
      }
      if (currentInside) result.push(current);
      previous = current;
    }
  }
  return result;
}

export function pirFootprint(origin: PlanPoint, target: PlanPoint, room: Room, radius: number, fieldOfView: number, segments: number): PlanPoint[] {
  const heading = Math.atan2(target.z - origin.z, target.x - origin.x);
  const points: PlanPoint[] = [origin];
  for (let index = 0; index <= segments; index++) {
    const angle = heading - fieldOfView / 2 + (fieldOfView * index) / segments;
    points.push({ x: origin.x + Math.cos(angle) * radius, z: origin.z + Math.sin(angle) * radius });
  }
  return clipToRoom(points, room);
}
