import { devices } from "@/data/agencia-demo";
import { useSecurityStore } from "@/store/useSecurityStore";
import CameraCone from "./CameraCone";
import PirFan from "./PirFan";
import SmokeRadius from "./SmokeRadius";

export default function CoverageLayer() {
  const coverage = useSecurityStore((state) => state.coverage);
  const visible = useSecurityStore((state) => state.visibleTypes);
  return (
    <group name="coberturas">
      {devices.map((device) => {
        if (!visible[device.tipo]) return null;
        if (device.tipo === "camara" && coverage.camara) return <CameraCone key={device.id} device={device} />;
        if (device.tipo === "pir" && coverage.pir) return <PirFan key={device.id} device={device} />;
        if (device.tipo === "humo" && coverage.humo) return <SmokeRadius key={device.id} device={device} />;
        return null;
      })}
    </group>
  );
}
