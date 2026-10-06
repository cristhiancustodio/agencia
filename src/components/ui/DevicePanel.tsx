"use client";

import { X, MapPin } from "lucide-react";
import { useEffect, useRef } from "react";
import { devices, rooms } from "@/data/agencia-demo";
import { deviceStyles, testStatusStyles } from "@/lib/deviceStyles";
import { useSecurityStore } from "@/store/useSecurityStore";
import DeviceTypeIcon from "./DeviceTypeIcon";
import TestForm from "./TestForm";

export default function DevicePanel() {
  const selectedId = useSecurityStore((state) => state.selectedId);
  const selectDevice = useSecurityStore((state) => state.selectDevice);
  const record = useSecurityStore((state) => selectedId ? state.records[selectedId] : undefined);
  const testMode = useSecurityStore((state) => state.testMode);
  const closeButton = useRef<HTMLButtonElement>(null);
  useEffect(() => { if (selectedId) closeButton.current?.focus({ preventScroll: true }); }, [selectedId]);
  const device = devices.find((item) => item.id === selectedId);
  if (!device) return null;
  const room = rooms.find((item) => item.id === device.ambienteId);
  return (
    <aside className="inspector" aria-label={`Ficha de ${device.id}`}>
      <div className="inspector-header"><p className="eyebrow">Ficha del dispositivo</p><button ref={closeButton} className="icon-button" aria-label="Cerrar ficha" onClick={() => { selectDevice(null); document.getElementById(`device-list-${device.id}`)?.focus({ preventScroll: true }); }}><X size={18} /></button></div>
      <div className="device-title"><span style={{ color: deviceStyles[device.tipo].color }}><DeviceTypeIcon type={device.tipo} size={28} /></span><div><p>{device.id}</p><h2>{device.nombre}</h2></div></div>
      <p className="device-room"><MapPin size={14} />{room?.nombre}</p>
      <dl className="device-facts">
        <div><dt>Tipo</dt><dd>{deviceStyles[device.tipo].nombre}</dd></div>
        <div><dt>Zona de panel</dt><dd>{device.zonaPanel ?? "No asignada"}</dd></div>
        <div><dt>Marca</dt><dd>{device.marca ?? "Sin especificar"}</dd></div>
        <div><dt>Estado de prueba</dt><dd className={`test-status status-${record?.estado ?? "pendiente"}`}>{testStatusStyles[record?.estado ?? "pendiente"].nombre}</dd></div>
        <div><dt>Última prueba</dt><dd>{record?.fecha ? new Intl.DateTimeFormat("es-PE", { dateStyle: "short", timeStyle: "short" }).format(new Date(record.fecha)) : "Sin prueba registrada"}</dd></div>
      </dl>
      {testMode ? <TestForm key={device.id} deviceId={device.id} initialObservation={record?.observacion ?? ""} /> : record?.observacion ? <div className="saved-observation"><h3>Observación de prueba</h3><p>{record.observacion}</p></div> : <p className="panel-note">Activa el modo prueba para registrar OK o Falla.</p>}
      <p className="panel-note">{device.notas ?? "Sin notas adicionales para este dispositivo."}</p>
      <div className="position-data">X {device.posicion.x} · Y {device.posicion.y} · Z {device.posicion.z} m</div>
    </aside>
  );
}
