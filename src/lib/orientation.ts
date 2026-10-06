import { Quaternion, Vector3 } from "three";
import type { Vec3 } from "@/types";

/** Los símbolos dirigidos miran al eje local +Z. */
export function lookAtTarget(origin: Vec3, target?: Vec3): Quaternion {
  if (!target) return new Quaternion();
  const direction = new Vector3(target.x - origin.x, target.y - origin.y, target.z - origin.z);
  if (direction.lengthSq() === 0) return new Quaternion();
  return new Quaternion().setFromUnitVectors(new Vector3(0, 0, 1), direction.normalize());
}
