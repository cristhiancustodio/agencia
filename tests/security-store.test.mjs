import assert from "node:assert/strict";
import { test } from "node:test";
import { createSecurityStore } from "../src/store/useSecurityStore.ts";
import { devices } from "../src/data/agencia-demo.ts";
import { sanitizeRecords, summarizeTests } from "../src/lib/testRecords.ts";

function memoryStorage() {
  const entries = new Map();
  return { entries, getItem: (key) => entries.get(key) ?? null, setItem: (key, value) => { entries.set(key, value); }, removeItem: (key) => { entries.delete(key); } };
}
async function loaded(storage) {
  const store = createSecurityStore(storage);
  await store.persist.rehydrate();
  store.getState().finishHydration();
  return store;
}

test("Se exige modo prueba e hidratación antes de registrar resultados", async () => {
  const store = createSecurityStore(memoryStorage());
  store.getState().saveTest("CAM-01", "ok", "No debe guardarse");
  assert.deepEqual(store.getState().records, {});
  await store.persist.rehydrate();
  store.getState().finishHydration();
  store.getState().saveTest("CAM-01", "ok", "Tampoco fuera de modo prueba");
  assert.deepEqual(store.getState().records, {});
  store.getState().toggleTestMode();
  store.getState().saveTest("CAM-01", "ok", "  Imagen verificada  ");
  assert.equal(store.getState().records["CAM-01"].observacion, "Imagen verificada");
  assert.ok(Number.isFinite(Date.parse(store.getState().records["CAM-01"].fecha)));
});

test("Resultados, observaciones y fechas sobreviven a una recarga", async () => {
  const storage = memoryStorage();
  const first = await loaded(storage);
  first.getState().toggleTestMode();
  first.getState().saveTest("CAM-01", "ok", "Imagen correcta");
  first.getState().saveTest("PIR-01", "falla", "No detecta movimiento");
  first.getState().toggleCoverage("camara");
  first.getState().selectDevice("PIR-01");
  const second = await loaded(storage);
  assert.deepEqual(second.getState().records, first.getState().records);
  assert.equal(second.getState().testMode, false);
  assert.equal(second.getState().selectedId, null);
  assert.equal(second.getState().coverage.camara, false);
  assert.deepEqual(summarizeTests(devices, second.getState().records), { ok: 1, falla: 1, pendiente: 29, completed: 2, total: 31, percentage: 6 });
});

test("Un recorrido completo llega al 100 % y el reinicio persiste", async () => {
  const storage = memoryStorage();
  const store = await loaded(storage);
  store.getState().toggleTestMode();
  devices.forEach((device) => store.getState().saveTest(device.id, "ok", ""));
  assert.equal(summarizeTests(devices, store.getState().records).percentage, 100);
  store.getState().resetTests();
  const restored = await loaded(storage);
  assert.equal(summarizeTests(devices, restored.getState().records).pendiente, 31);
});

test("Ocultar un tipo deselecciona sus equipos y una selección lo vuelve a mostrar", async () => {
  const store = await loaded(memoryStorage());
  store.getState().selectDevice("CAM-01");
  store.getState().toggleType("camara");
  assert.equal(store.getState().selectedId, null);
  assert.equal(store.getState().visibleTypes.camara, false);
  store.getState().selectDevice("CAM-01");
  assert.equal(store.getState().visibleTypes.camara, true);
  store.getState().saveTest("DESCONOCIDO", "ok", "");
  assert.equal(store.getState().records.DESCONOCIDO, undefined);
});

test("Registros corruptos o ajenos no alteran el resumen", () => {
  const clean = sanitizeRecords({
    "CAM-01": { estado: "ok", fecha: "fecha inválida", observacion: "x".repeat(3000) },
    "CAM-02": { estado: ["ok"] },
    "CAM-03": { estado: "inventado" },
    "OTRO": { estado: "falla" },
  }, devices.map((device) => device.id));
  assert.deepEqual(Object.keys(clean), ["CAM-01"]);
  assert.equal(clean["CAM-01"].fecha, undefined);
  assert.equal(clean["CAM-01"].observacion.length, 2000);
  assert.equal(summarizeTests(devices, clean).completed, 1);
});

test("Un almacenamiento bloqueado informa del error y permite una sesión temporal", async () => {
  const storage = { getItem: () => { throw new Error("bloqueado"); }, setItem: () => { throw new Error("bloqueado"); }, removeItem: () => {} };
  const store = await loaded(storage);
  assert.equal(store.getState().storageError, true);
  store.getState().toggleTestMode();
  store.getState().saveTest("PIR-01", "falla", "Resultado en memoria");
  assert.equal(store.getState().records["PIR-01"].estado, "falla");
});

test("Un JSON malformado no bloquea el inicio", async () => {
  const storage = memoryStorage();
  storage.setItem("agencia-demo-walk-test", "{invalid-json");
  const store = await loaded(storage);
  assert.equal(store.getState().hydrated, true);
  assert.equal(store.getState().storageError, true);
  assert.deepEqual(store.getState().records, {});
});
