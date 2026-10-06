"use client";

import { devices } from "@/data/agencia-demo";
import { deviceStyles } from "@/lib/deviceStyles";
import { useSecurityStore } from "@/store/useSecurityStore";
import DeviceTypeIcon from "./DeviceTypeIcon";

export default function DeviceList({ onSelect }: { onSelect?: () => void }) {
  const visible = useSecurityStore((state) => state.visibleTypes);
  const selectedId = useSecurityStore((state) => state.selectedId);
  const selectDevice = useSecurityStore((state) => state.selectDevice);
  const records = useSecurityStore((state) => state.records);
  const filtered = devices.filter((device) => visible[device.tipo]);
  return (
    <section className="panel-section inventory-section">
      <div className="section-heading"><h2>Inventario</h2><span className="mini-count">{filtered.length} / {devices.length}</span></div>
      <div className="device-list" aria-label="Inventario de dispositivos">
        {filtered.map((device) => (
          <button key={device.id} id={`device-list-${device.id}`} className="device-row" aria-pressed={selectedId === device.id} onClick={() => { selectDevice(device.id); onSelect?.(); }}>
            <i style={{ color: deviceStyles[device.tipo].color }}><DeviceTypeIcon type={device.tipo} size={15} /></i>
            <span><strong>{device.id}</strong><small>{device.nombre}</small></span>
            <span className={`record-dot record-${records[device.id]?.estado ?? "pendiente"}`} aria-label={`Estado: ${records[device.id]?.estado ?? "pendiente"}`} />
          </button>
        ))}
        {filtered.length === 0 && <p className="panel-note">No hay equipos visibles. Activa un tipo o pulsa «Mostrar todos».</p>}
      </div>
    </section>
  );
}
