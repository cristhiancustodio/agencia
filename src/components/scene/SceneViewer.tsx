"use client";

import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import SceneErrorBoundary from "./SceneErrorBoundary";

// El Canvas nunca se evalúa en el servidor.
const SceneCanvas = dynamic(() => import("./SceneCanvas"), {
  ssr: false,
  loading: () => null,
});

export default function SceneViewer() {
  const [ready, setReady] = useState(false);
  const onReady = useCallback(() => setReady(true), []);
  return <SceneErrorBoundary><SceneCanvas onReady={onReady} />{!ready && <div className="loading-overlay" role="status"><span className="loading-ring" /><strong>Preparando la agencia</strong><span>Cargando el plano y los dispositivos…</span></div>}</SceneErrorBoundary>;
}
