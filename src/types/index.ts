export type DeviceType = "camara" | "pir" | "humo" | "contacto" | "pulsador";
export type TestStatus = "pendiente" | "ok" | "falla";
export type WallType = "muro" | "mostrador" | "vidrio";
export type CameraView = "isometrica" | "planta";
export type WallMode = "completa" | "recortada";
export type CoverageType = "camara" | "pir" | "humo";

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface PlanPoint {
  x: number;
  z: number;
}

export interface Room extends PlanPoint {
  id: string;
  nombre: string;
  ancho: number;
  fondo: number;
  color: string;
  restringido?: boolean;
}

export interface DoorOpening {
  id: string;
  nombre: string;
  /** Metros desde `desde` hasta el centro de la abertura, siguiendo el muro. */
  posicion: number;
  ancho: number;
}

export interface WallSegment {
  id: string;
  desde: PlanPoint;
  hasta: PlanPoint;
  aberturas?: DoorOpening[];
  tipo?: WallType;
}

export interface Device {
  id: string;
  tipo: DeviceType;
  nombre: string;
  ambienteId: string;
  posicion: Vec3;
  objetivo?: Vec3;
  zonaPanel?: number;
  marca?: string;
  notas?: string;
}

export interface TestRecord {
  estado: TestStatus;
  /** Fecha y hora de la prueba en formato ISO. */
  fecha?: string;
  observacion?: string;
}

export interface AgencyConfig {
  nombre: string;
  ficticia: boolean;
  origen: Vec3;
  ancho: number;
  fondo: number;
  alturaMuros: number;
  fachadaZ: number;
  alturasInstalacion: Record<DeviceType, number>;
  perfilesMuros: Record<WallType, { base: number; altura: number }>;
}

export interface TellerWindow {
  id: string;
  nombre: string;
  centro: PlanPoint;
  mostradorId: string;
  vidrioId: string;
}
