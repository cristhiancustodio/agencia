import { useMemo, type ReactNode } from "react";
import { Html } from "@react-three/drei";
import { useThree } from "@react-three/fiber";

export default function SceneLabel({
  position,
  children,
}: {
  position: [number, number, number];
  children: ReactNode;
}) {
  const gl = useThree((state) => state.gl);
  // Un destino estable evita recrear las raíces HTML al conectar los eventos del Canvas.
  const portal = useMemo(() => {
    const container = gl.domElement.parentElement;
    return container ? { current: container } : undefined;
  }, [gl]);

  return (
    <Html portal={portal} position={position} center zIndexRange={[10, 0]} style={{ pointerEvents: "none" }}>
      {children}
    </Html>
  );
}
