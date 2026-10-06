"use client";

import { useSecurityStore } from "@/store/useSecurityStore";
import type { CoverageType } from "@/types";
import { devices } from "@/data/agencia-demo";
import { deviceStyles } from "@/lib/deviceStyles";
import { deviceTypes } from "@/lib/deviceTypes";
import DeviceTypeIcon from "./DeviceTypeIcon";

const coverages: { type: CoverageType; title: string; detail: string }[] = [
  { type: "camara", title: "Cámaras", detail: "90° · 8 m" },
  { type: "pir", title: "Sensores PIR", detail: "90° · 10 m" },
  { type: "humo", title: "Detectores de humo", detail: "Radio de 4.5 m" },
];

export default function FilterPanel() {
  const coverage = useSecurityStore((state) => state.coverage);
  const toggleCoverage = useSecurityStore((state) => state.toggleCoverage);
  const visible = useSecurityStore((state) => state.visibleTypes);
  const toggleType = useSecurityStore((state) => state.toggleType);
  const showAll = useSecurityStore((state) => state.showAll);
  return (
    <>
    <section className="panel-section" aria-label="Filtros de dispositivos">
      <div className="section-heading"><h2>Dispositivos</h2><button className="text-button" onClick={showAll}>Mostrar todos</button></div>
      {deviceTypes.map((type) => (
        <label className="filter-row" key={type}>
          <span className="type-label"><i style={{ color: deviceStyles[type].color }}><DeviceTypeIcon type={type} /></i>{deviceStyles[type].nombre}<b>{devices.filter((device) => device.tipo === type).length}</b></span>
          <input type="checkbox" checked={visible[type]} onChange={() => toggleType(type)} aria-label={`Mostrar ${deviceStyles[type].nombre.toLowerCase()}`} />
        </label>
      ))}
    </section>
    <section className="panel-section" aria-label="Coberturas">
      <h2>Coberturas</h2>
      {coverages.map(({ type, title, detail }) => (
        <label key={type} className="filter-row">
          <span>{title}<small>{detail}</small></span>
          <input type="checkbox" role="switch" aria-label={`Cobertura de ${title.toLowerCase()}`} checked={coverage[type]} onChange={() => toggleCoverage(type)} />
        </label>
      ))}
      <p className="panel-note">Coberturas geométricas orientativas. Las cámaras y el humo no simulan obstáculos; los PIR se recortan al ambiente.</p>
    </section>
    </>
  );
}
