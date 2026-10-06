"use client";

import { Grid } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { PCFShadowMap } from "three";
import { sceneConfig } from "@/data/agencia-demo";
import { toTuple } from "@/lib/geometry";
import CameraRig from "./CameraRig";
import SceneContent from "./SceneContent";
import SceneEffects from "./SceneEffects";
import { useSecurityStore } from "@/store/useSecurityStore";

export default function SceneCanvas({ onReady }: { onReady: () => void }) {
  const { camara, centro, colores, luz, suelo } = sceneConfig;
  const selectDevice = useSecurityStore((state) => state.selectDevice);

  return (
    <Canvas
      orthographic
      shadows={{ type: PCFShadowMap }}
      frameloop="demand"
      dpr={[1, 2]}
      camera={{ position: toTuple(camara.posiciones.isometrica), near: camara.near, far: camara.far }}
      gl={{ antialias: true }}
      onCreated={onReady}
      onPointerMissed={(event) => { if (event.type === "click") selectDevice(null); }}
      fallback={<p className="scene-message">Tu navegador necesita WebGL para mostrar el plano 3D.</p>}
    >
      <color attach="background" args={[colores.fondo]} />
      <ambientLight intensity={luz.intensidadAmbiente} />
      <directionalLight
        position={toTuple(luz.posicion)}
        intensity={luz.intensidadDireccional}
        castShadow
        shadow-mapSize={[luz.sombra.resolucion, luz.sombra.resolucion]}
        shadow-camera-left={-luz.sombra.extension}
        shadow-camera-right={luz.sombra.extension}
        shadow-camera-top={luz.sombra.extension}
        shadow-camera-bottom={-luz.sombra.extension}
        shadow-camera-near={luz.sombra.near}
        shadow-camera-far={luz.sombra.far}
        shadow-normalBias={0.04}
        shadow-bias={-0.0001}
      />
      <mesh position={[centro.x, suelo.altura, centro.z]} rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[suelo.extension, suelo.extension]} />
        <meshStandardMaterial color={colores.suelo} roughness={1} />
      </mesh>
      <Grid
        position={[centro.x, suelo.altura + sceneConfig.piso.altura, centro.z]}
        args={[suelo.extension, suelo.extension]}
        cellSize={1}
        sectionSize={5}
        cellColor={colores.reticula}
        sectionColor={colores.reticulaPrincipal}
        cellThickness={0.5}
        sectionThickness={0.8}
        fadeDistance={45}
        fadeStrength={2}
      />
      <SceneContent />
      <SceneEffects />
      <CameraRig />
    </Canvas>
  );
}
