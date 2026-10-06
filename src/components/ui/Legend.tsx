import { deviceStyles, testStatusStyles } from "@/lib/deviceStyles";
import { deviceTypes } from "@/lib/deviceTypes";
import DeviceTypeIcon from "./DeviceTypeIcon";

export default function Legend() {
  return (
    <details className="legend panel-section">
      <summary>Leyenda y estados</summary>
      {deviceTypes.map((type) => <div className="legend-item" key={type}><span style={{ color: deviceStyles[type].color }}><DeviceTypeIcon type={type} /></span><span><strong>{deviceStyles[type].nombre}</strong><small>{deviceStyles[type].forma}</small></span></div>)}
      <div className="status-legend">{Object.entries(testStatusStyles).map(([key, style]) => <span key={key}><i style={{ background: style.color }} />{style.nombre}</span>)}</div>
    </details>
  );
}
