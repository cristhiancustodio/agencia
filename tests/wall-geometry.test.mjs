import assert from "node:assert/strict";
import { test } from "node:test";
import { buildWallPieces } from "../src/lib/geometry.ts";
import { agency, sceneConfig, walls } from "../src/data/agencia-demo.ts";

const close = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-9, `${actual} != ${expected}`);
const solidWalls = walls.filter((wall) => wall.tipo === "muro");

for (const height of [agency.alturaMuros, sceneConfig.alturaRecortada]) {
  test(`Los muros de ${height} m conservan las ocho aberturas libres`, () => {
    for (const wall of solidWalls) {
      const dx = wall.hasta.x - wall.desde.x;
      const dz = wall.hasta.z - wall.desde.z;
      const length = Math.hypot(dx, dz);
      const pieces = buildWallPieces(wall, 0, height, sceneConfig.grosorMuros, sceneConfig.alturaPuertas);
      const area = pieces.reduce((sum, piece) => sum + piece.dimensiones[0] * piece.dimensiones[1], 0);
      const openingArea = (wall.aberturas ?? []).reduce((sum, door) => sum + door.ancho * Math.min(height, sceneConfig.alturaPuertas), 0);
      close(area, length * height - openingArea);

      for (const piece of pieces) {
        const [x, y, z] = piece.posicion;
        const [width, pieceHeight, thickness] = piece.dimensiones;
        const along = ((x - wall.desde.x) * dx + (z - wall.desde.z) * dz) / length;
        close((x - wall.desde.x) * dz - (z - wall.desde.z) * dx, 0);
        close(thickness, 0.15);
        close(piece.rotacionY, -Math.atan2(dz, dx));
        assert.ok(width > 0 && pieceHeight > 0);
        assert.ok(along - width / 2 >= -1e-9 && along + width / 2 <= length + 1e-9);
        for (const door of wall.aberturas ?? []) {
          const overlap = Math.min(along + width / 2, door.posicion + door.ancho / 2)
            - Math.max(along - width / 2, door.posicion - door.ancho / 2);
          if (overlap > 1e-9) assert.ok(y - pieceHeight / 2 >= sceneConfig.alturaPuertas - 1e-9);
        }
      }
    }
  });
}

test("Los dinteles aparecen solo por encima de las puertas en la vista completa", () => {
  const countLintels = (height) => solidWalls.flatMap((wall) =>
    buildWallPieces(wall, 0, height, sceneConfig.grosorMuros, sceneConfig.alturaPuertas),
  ).filter((piece) => piece.id.includes("-dintel-"));
  const full = countLintels(agency.alturaMuros);
  assert.equal(full.length, 8);
  full.forEach((piece) => close(piece.dimensiones[1], 0.8));
  assert.equal(countLintels(sceneConfig.alturaRecortada).length, 0);
});

test("Mostrador y vidrio son contiguos y terminan a 2.2 m", () => {
  for (const type of ["mostrador", "vidrio"]) {
    const wall = walls.find((wall) => wall.tipo === type);
    const profile = agency.perfilesMuros[type];
    const [piece] = buildWallPieces(wall, profile.base, profile.altura, 0.15, 2.2);
    assert.equal(piece.dimensiones[0], 6);
    close(piece.posicion[1] - piece.dimensiones[1] / 2, type === "vidrio" ? 1.1 : 0);
    close(piece.posicion[1] + piece.dimensiones[1] / 2, type === "vidrio" ? 2.2 : 1.1);
  }
});

test("Un segmento sin longitud o sin altura no genera geometría", () => {
  const point = { x: 0, z: 0 };
  assert.deepEqual(buildWallPieces({ id: "empty", desde: point, hasta: point }, 0, 3, 0.15, 2.2), []);
  assert.deepEqual(buildWallPieces(walls[0], 0, 0, 0.15, 2.2), []);
});
