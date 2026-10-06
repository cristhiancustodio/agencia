"use client";

import { Box, ClipboardCheck, Layers2, Map, RotateCcw, ShieldCheck } from "lucide-react";
import { agency, sceneConfig } from "@/data/agencia-demo";
import { useSecurityStore } from "@/store/useSecurityStore";

export default function TopBar() {
  const view = useSecurityStore((state) => state.view);
  const wallMode = useSecurityStore((state) => state.wallMode);
  const setView = useSecurityStore((state) => state.setView);
  const resetView = useSecurityStore((state) => state.resetView);
  const toggleWalls = useSecurityStore((state) => state.toggleWalls);
  const fullWalls = wallMode === "completa";
  const testMode = useSecurityStore((state) => state.testMode);
  const hydrated = useSecurityStore((state) => state.hydrated);
  const toggleTestMode = useSecurityStore((state) => state.toggleTestMode);

  return (
    <header className="topbar">
      <div className="brand">
        <span className="brand-icon"><ShieldCheck size={23} strokeWidth={1.6} /></span>
        <div>
          <p className="eyebrow">Visor de agencia</p>
          <h1>Mapa de seguridad</h1>
        </div>
      </div>
      <div className="view-controls">
        <button className="test-mode-button" aria-pressed={testMode} disabled={!hydrated} onClick={toggleTestMode}><ClipboardCheck size={16} />{testMode ? "Salir de prueba" : "Modo prueba"}</button>
        <div className="view-switch" role="group" aria-label="Vista del plano">
          <button type="button" aria-pressed={view === "isometrica"} onClick={() => setView("isometrica")}>
            <Box size={16} /> Isométrica
          </button>
          <button type="button" aria-pressed={view === "planta"} onClick={() => setView("planta")}>
            <Map size={16} /> Planta
          </button>
        </div>
        <span className="toolbar-divider" />
        <button type="button" className="wall-button" aria-pressed={fullWalls} onClick={toggleWalls}>
          <Layers2 size={17} />
          <span>Muros {fullWalls ? "completos" : "recortados"}</span>
          <span className="height-value">{fullWalls ? agency.alturaMuros : sceneConfig.alturaRecortada} m</span>
        </button>
        <button type="button" className="reset-button" aria-label="Restablecer vista isométrica" title="Restablecer vista isométrica" onClick={resetView}>
          <RotateCcw size={17} />
        </button>
      </div>
    </header>
  );
}
