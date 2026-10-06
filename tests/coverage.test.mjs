import assert from "node:assert/strict";
import { test } from "node:test";
import { Vector3 } from "three";
import { devices, rooms, coverageSettings } from "../src/data/agencia-demo.ts";
import { clipToRoom, pirFootprint } from "../src/lib/coverage.ts";
import { lookAtTarget } from "../src/lib/orientation.ts";

test("Todos los PIR quedan dentro de su ambiente, alcance y campo de visión", () => {
  const settings = coverageSettings.pir;
  for (const device of devices.filter((item) => item.tipo === "pir")) {
    const room = rooms.find((item) => item.id === device.ambienteId);
    const polygon = pirFootprint(device.posicion, device.objetivo, room, settings.alcance, settings.angulo, settings.segmentos);
    assert.ok(polygon.length >= 3, device.id);
    const heading = new Vector3(device.objetivo.x - device.posicion.x, 0, device.objetivo.z - device.posicion.z).normalize();
    for (const point of polygon) {
      assert.ok(point.x >= room.x - 1e-8 && point.x <= room.x + room.ancho + 1e-8, device.id);
      assert.ok(point.z >= room.z - 1e-8 && point.z <= room.z + room.fondo + 1e-8, device.id);
      const ray = new Vector3(point.x - device.posicion.x, 0, point.z - device.posicion.z);
      assert.ok(ray.length() <= settings.alcance + 1e-8);
      if (ray.length() > 1e-8) assert.ok(ray.normalize().dot(heading) >= Math.cos(settings.angulo / 2) - 1e-8);
    }
    const area = Math.abs(polygon.reduce((sum, p, i) => { const next = polygon[(i + 1) % polygon.length]; return sum + p.x * next.z - next.x * p.z; }, 0)) / 2;
    assert.ok(area > 0 && area <= room.ancho * room.fondo + 1e-8);
  }
});

test("Un polígono exterior se recorta a vacío", () => {
  assert.deepEqual(clipToRoom([{ x: -5, z: -5 }, { x: -3, z: -5 }, { x: -3, z: -3 }], rooms[0]), []);
});

test("Las ocho cámaras y los siete PIR apuntan exactamente a sus objetivos", () => {
  const aimed = devices.filter((device) => device.objetivo);
  assert.equal(aimed.length, 15);
  for (const device of aimed) {
    const forward = new Vector3(0, 0, 1).applyQuaternion(lookAtTarget(device.posicion, device.objetivo));
    const direction = new Vector3(device.objetivo.x - device.posicion.x, device.objetivo.y - device.posicion.y, device.objetivo.z - device.posicion.z).normalize();
    assert.ok(forward.dot(direction) > 1 - 1e-10, device.id);
  }
});
