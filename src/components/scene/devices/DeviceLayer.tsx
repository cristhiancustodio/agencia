import { devices } from "@/data/agencia-demo";
import DeviceMarker from "./DeviceMarker";
import { useSecurityStore } from "@/store/useSecurityStore";

export default function DeviceLayer() {
  const visible = useSecurityStore((state) => state.visibleTypes);
  return <group name="dispositivos">{devices.filter((device) => visible[device.tipo]).map((device) => <DeviceMarker key={device.id} device={device} />)}</group>;
}
