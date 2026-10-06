import { useEffect, useRef } from "react";
import { OrbitControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { MathUtils, OrthographicCamera, Spherical, Vector3 } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { devices, sceneConfig } from "@/data/agencia-demo";
import { toTuple } from "@/lib/geometry";
import { useSecurityStore } from "@/store/useSecurityStore";

interface Transition {
  from: Spherical;
  to: Spherical;
  fromZoom: number;
  toZoom: number;
  elapsed: number;
  fromTarget: Vector3;
  toTarget: Vector3;
}

export default function CameraRig() {
  const controls = useRef<OrbitControlsImpl>(null);
  const transition = useRef<Transition | null>(null);
  const initialized = useRef(false);
  const orbit = useRef(new Spherical());
  const offset = useRef(new Vector3());
  const { size, invalidate } = useThree();
  const view = useSecurityStore((state) => state.view);
  const revision = useSecurityStore((state) => state.viewRevision);
  const selectedId = useSecurityStore((state) => state.selectedId);
  const config = sceneConfig.camara;
  const frame = config.encuadre[view];
  const fitZoom = Math.min(size.width / frame.ancho, size.height / frame.alto);

  useEffect(() => {
    if (!controls.current) return;
    const control = controls.current;
    const camera = control.object;
    if (!(camera instanceof OrthographicCamera)) return;
    const selected = devices.find((device) => device.id === selectedId);
    const target = new Vector3(...toTuple(selected?.posicion ?? sceneConfig.centro));
    const destination = new Vector3(...toTuple(config.posiciones[view])).sub(new Vector3(...toTuple(sceneConfig.centro))).add(target);
    const destinationZoom = fitZoom * (selected ? 1.6 : 1);

    if (!initialized.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      camera.position.copy(destination);
      camera.zoom = destinationZoom;
      control.target.copy(target);
      camera.updateProjectionMatrix();
      control.enabled = true;
      control.update();
      transition.current = null;
      initialized.current = true;
    } else {
      const from = new Spherical().setFromVector3(camera.position.clone().sub(control.target));
      const to = new Spherical().setFromVector3(destination.sub(target));
      // Tomar el arco más corto incluso después de girar varias vueltas.
      to.theta = from.theta + MathUtils.euclideanModulo(to.theta - from.theta + Math.PI, Math.PI * 2) - Math.PI;
      transition.current = { from, to, fromZoom: camera.zoom, toZoom: destinationZoom, elapsed: 0, fromTarget: control.target.clone(), toTarget: target };
      control.enabled = false;
    }
    invalidate();
  }, [config, fitZoom, invalidate, revision, selectedId, view]);

  useFrame(({ camera }, delta) => {
    const active = transition.current;
    const control = controls.current;
    if (!active || !control || !(camera instanceof OrthographicCamera)) return;

    active.elapsed += delta;
    const progress = Math.min(active.elapsed / config.duracionTransicion, 1);
    const eased = progress * progress * (3 - 2 * progress);
    orbit.current.set(
      MathUtils.lerp(active.from.radius, active.to.radius, eased),
      MathUtils.lerp(active.from.phi, active.to.phi, eased),
      MathUtils.lerp(active.from.theta, active.to.theta, eased),
    );
    control.target.lerpVectors(active.fromTarget, active.toTarget, eased);
    camera.position.copy(offset.current.setFromSpherical(orbit.current)).add(control.target);
    camera.zoom = MathUtils.lerp(active.fromZoom, active.toZoom, eased);
    camera.updateProjectionMatrix();
    control.update();

    if (progress === 1) {
      transition.current = null;
      control.enabled = true;
    }
    invalidate();
  });

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enablePan={false}
      enableRotate={view === "isometrica"}
      enableDamping
      dampingFactor={0.12}
      minPolarAngle={config.anguloPolarMinimo}
      maxPolarAngle={config.anguloPolarMaximo}
      minZoom={fitZoom * config.zoomMinimo}
      maxZoom={fitZoom * config.zoomMaximo}
      zoomSpeed={0.8}
    />
  );
}
