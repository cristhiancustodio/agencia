"use client";

import { useRef } from "react";
import { RotateCcw, CheckCheck } from "lucide-react";
import { devices } from "@/data/agencia-demo";
import { summarizeTests } from "@/lib/testRecords";
import { useSecurityStore } from "@/store/useSecurityStore";

export default function TestSummary() {
  const records = useSecurityStore((state) => state.records);
  const testMode = useSecurityStore((state) => state.testMode);
  const hydrated = useSecurityStore((state) => state.hydrated);
  const storageError = useSecurityStore((state) => state.storageError);
  const resetTests = useSecurityStore((state) => state.resetTests);
  const dialog = useRef<HTMLDialogElement>(null);
  const summary = summarizeTests(devices, records);
  return (
    <>
      <section className={`test-summary${testMode ? " is-testing" : ""}`} aria-label="Resumen del recorrido de prueba">
        <div className="progress-description"><CheckCheck size={17} /><span><strong>{testMode ? "Prueba de recorrido" : "Estado del recorrido"}</strong><small>{!hydrated ? "Recuperando resultados…" : storageError ? "Solo esta sesión" : "Guardado en este navegador"}</small></span></div>
        <div className="summary-counts" aria-live="polite"><span className="status-ok"><b>{summary.ok}</b> OK</span><span className="status-falla"><b>{summary.falla}</b> Falla</span><span><b>{summary.pendiente}</b> Pendientes</span></div>
        <div className="test-progress"><progress max={summary.total} value={summary.completed} aria-label="Avance del recorrido" /><span>{summary.percentage}%</span></div>
        {testMode && <button className="reset-test" disabled={!summary.completed || !hydrated} onClick={() => dialog.current?.showModal()}><RotateCcw size={13} /> Reiniciar prueba</button>}
      </section>
      <dialog ref={dialog} className="reset-dialog" aria-labelledby="reset-title" aria-describedby="reset-description">
        <h2 id="reset-title">¿Reiniciar la prueba?</h2>
        <p id="reset-description">Los {devices.length} dispositivos volverán a pendiente. Se eliminarán las fechas y observaciones del recorrido guardado.</p>
        <div><button autoFocus onClick={() => dialog.current?.close()}>Cancelar</button><button className="confirm-reset" onClick={() => { resetTests(); dialog.current?.close(); }}>Sí, reiniciar prueba</button></div>
      </dialog>
    </>
  );
}
