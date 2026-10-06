"use client";

import { useEffect, useState } from "react";
import { SlidersHorizontal, ScanLine, MousePointer2 } from "lucide-react";
import { agency } from "@/data/agencia-demo";
import { useSecurityStore } from "@/store/useSecurityStore";
import SceneViewer from "../scene/SceneViewer";
import FilterPanel from "./FilterPanel";
import DeviceList from "./DeviceList";
import DevicePanel from "./DevicePanel";
import Legend from "./Legend";
import TestSummary from "./TestSummary";

export default function SecurityWorkspace() {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const selectedId = useSecurityStore((state) => state.selectedId);
  const selectDevice = useSecurityStore((state) => state.selectDevice);
  const storageError = useSecurityStore((state) => state.storageError);
  useEffect(() => {
    void Promise.resolve(useSecurityStore.persist.rehydrate()).finally(() => useSecurityStore.getState().finishHydration());
  }, []);
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape" && !document.querySelector("dialog[open]")) selectDevice(null); };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectDevice]);

  return (
    <>
    <TestSummary />
    {storageError && <p className="storage-warning" role="alert">No se pueden guardar los resultados en este navegador. El recorrido funciona en esta sesión, pero podría perderse al cerrar o recargar.</p>}
    <div className={`workbench${selectedId ? " has-selection" : ""}`}>
      <aside className={`sidebar${filtersOpen ? " is-open" : ""}`}>
        <button className="sidebar-toggle" aria-expanded={filtersOpen} aria-controls="sidebar-content" onClick={() => setFiltersOpen(!filtersOpen)}><SlidersHorizontal size={16} /> Capas e inventario <span>{filtersOpen ? "Ocultar" : "Mostrar"}</span></button>
        <div id="sidebar-content" className="sidebar-content"><FilterPanel /><DeviceList onSelect={() => setFiltersOpen(false)} /><Legend /></div>
      </aside>
      <section className="scene-stage" aria-label="Plano 3D interactivo de la agencia">
        <div className="scene-caption"><p className="eyebrow"><span className="status-dot" /> Mapa interactivo</p><p className="scene-subtitle">Cada dispositivo,<br />en su lugar.</p></div>
        <div className="plan-dimensions"><ScanLine size={15} />{agency.ancho} × {agency.fondo} m</div>
        <div className="canvas-container"><SceneViewer /></div>
        <div className="floor-key"><MousePointer2 size={13} /><span>Selecciona un dispositivo para ver su ficha</span></div>
      </section>
      <DevicePanel />
    </div>
    </>
  );
}
