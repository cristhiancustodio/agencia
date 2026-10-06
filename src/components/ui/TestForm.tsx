"use client";

import { useState } from "react";
import { Check, AlertTriangle } from "lucide-react";
import { useSecurityStore } from "@/store/useSecurityStore";

export default function TestForm({ deviceId, initialObservation }: { deviceId: string; initialObservation: string }) {
  const [observation, setObservation] = useState(initialObservation);
  const saveTest = useSecurityStore((state) => state.saveTest);
  const hydrated = useSecurityStore((state) => state.hydrated);
  const [saved, setSaved] = useState(false);
  function save(status: "ok" | "falla") {
    saveTest(deviceId, status, observation);
    setSaved(true);
  }
  return (
    <section className="test-form" aria-label="Registrar resultado de prueba">
      <label htmlFor={`observation-${deviceId}`}>Observación <span>opcional</span></label>
      <textarea id={`observation-${deviceId}`} maxLength={2000} rows={3} placeholder="Describe el resultado de la revisión…" value={observation} onChange={(event) => { setObservation(event.target.value); setSaved(false); }} />
      <div className="test-actions">
        <button className="result-ok" disabled={!hydrated} onClick={() => save("ok")}><Check size={17} /> OK</button>
        <button className="result-fail" disabled={!hydrated} onClick={() => save("falla")}><AlertTriangle size={16} /> Falla</button>
      </div>
      <p className="save-feedback" role="status">{saved ? "Resultado registrado. Puedes continuar con otro equipo." : "La fecha y hora se registran al marcar el resultado."}</p>
    </section>
  );
}
