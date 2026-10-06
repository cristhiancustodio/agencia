import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { useSecurityStore } from "@/store/useSecurityStore";

export default function SceneEffects() {
  const hasFailures = useSecurityStore((state) => Object.values(state.records).some((record) => record.estado === "falla"));
  if (!hasFailures) return null;
  return <EffectComposer multisampling={0}><Bloom intensity={0.4} luminanceThreshold={1} luminanceSmoothing={0.25} mipmapBlur /></EffectComposer>;
}
