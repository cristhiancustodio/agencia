import type {
  AgencyConfig,
  Device,
  Room,
  Vec3,
  TellerWindow,
  WallSegment,
} from "@/types";

/** Plano ficticio. Todas las dimensiones y coordenadas están en metros. */
export const agency: AgencyConfig = {
  nombre: "Agencia bancaria · Demo ficticia",
  ficticia: true,
  origen: { x: 0, y: 0, z: 0 },
  ancho: 12,
  fondo: 10,
  alturaMuros: 3,
  fachadaZ: 10,
  alturasInstalacion: {
    camara: 2.6,
    pir: 2.5,
    humo: 2.95,
    contacto: 2.1,
    pulsador: 0.7,
  },
  perfilesMuros: {
    muro: { base: 0, altura: 3 },
    mostrador: { base: 0, altura: 1.1 },
    vidrio: { base: 1.1, altura: 1.1 },
  },
};

/** Medidas y encuadres de la maqueta. Las posiciones de la escena viven aquí. */
export const sceneConfig = {
  entrada: { duracion: 0.7, escalaInicial: 0.96, desplazamientoY: -0.2 },
  centro: { x: agency.ancho / 2, y: agency.origen.y, z: agency.fondo / 2 },
  grosorMuros: 0.15,
  alturaRecortada: 1.2,
  // El plan no especifica esta altura: se adopta 2.2 m para las aberturas.
  alturaPuertas: 2.2,
  piso: { altura: 0.012, separacion: 0.035 },
  base: { margen: 0.25, grosor: 0.24 },
  suelo: { altura: -0.26, extension: 80 },
  etiquetas: { altura: 0.08, alturaVentanilla: 1.3 },
  camara: {
    posiciones: {
      isometrica: { x: 22, y: 16, z: 21 },
      // Un desplazamiento mínimo en Z mantiene estable la orientación vertical.
      planta: { x: 6, y: 25, z: 5.001 },
    },
    encuadre: {
      isometrica: { ancho: 19, alto: 16 },
      planta: { ancho: 16, alto: 14 },
    },
    near: 0.1,
    far: 150,
    zoomMinimo: 0.65,
    zoomMaximo: 2.6,
    anguloPolarMinimo: 0,
    anguloPolarMaximo: Math.PI / 2 - 0.12,
    duracionTransicion: 0.8,
  },
  luz: {
    posicion: { x: -3, y: 18, z: 10 },
    intensidadAmbiente: 0.9,
    intensidadDireccional: 1.8,
    sombra: { extension: 20, resolucion: 2048, near: 0.5, far: 60 },
  },
  colores: {
    fondo: "#20292e",
    suelo: "#293339",
    base: "#46555b",
    muro: "#edece3",
    mostrador: "#718c87",
    vidrio: "#a4dce1",
    borde: "#667471",
    reticula: "#354249",
    reticulaPrincipal: "#415159",
  },
};

export const rooms: Room[] = [
  { id: "boveda", nombre: "Bóveda / Tesorería", x: 0, z: 0, ancho: 3, fondo: 3, color: "#F5DEC4", restringido: true },
  { id: "comunicaciones", nombre: "Cuarto de comunicaciones", x: 3, z: 0, ancho: 2, fondo: 3, color: "#F1DFCE", restringido: true },
  { id: "bano", nombre: "Baño", x: 5, z: 0, ancho: 2, fondo: 3, color: "#DFEAF0" },
  { id: "pasillo", nombre: "Pasillo de servicio", x: 7, z: 0, ancho: 2, fondo: 3, color: "#E8E7DF" },
  { id: "gerencia", nombre: "Oficina de gerencia", x: 9, z: 0, ancho: 3, fondo: 3, color: "#DEE9DE" },
  { id: "area-interna", nombre: "Área interna de ventanillas", x: 0, z: 3, ancho: 9, fondo: 3, color: "#F2E4CF", restringido: true },
  { id: "plataforma", nombre: "Plataforma de atención", x: 9, z: 3, ancho: 3, fondo: 3, color: "#E1E8F0" },
  { id: "cajeros", nombre: "Zona de cajeros ATM", x: 0, z: 6, ancho: 3, fondo: 4, color: "#DFE9E7" },
  { id: "hall", nombre: "Hall de clientes", x: 3, z: 6, ancho: 9, fondo: 4, color: "#EDECE5" },
];

/** Ubicación de etiqueta ajustada para dejar visibles las tres ventanillas. */
export const roomLabelPositions: Partial<Record<string, Vec3>> = {
  "area-interna": { x: 1.8, y: sceneConfig.etiquetas.altura, z: 4.3 },
};

/** Tamaños de los símbolos 3D (metros), independientes de las posiciones reales. */
export const deviceVisuals = {
  camara: { cuerpo: [0.34, 0.22, 0.4] as [number, number, number], lenteRadio: 0.105, lenteLargo: 0.16, lenteZ: 0.27 },
  pir: { radio: 0.21 },
  humo: { radio: 0.24, alto: 0.085, centroRadio: 0.11 },
  contacto: { caja: [0.08, 0.23, 0.12] as [number, number, number], separacion: 0.065 },
  pulsador: { radio: 0.16, alto: 0.08, botonRadio: 0.12, botonAlto: 0.06, botonY: 0.06 },
  anillo: { interior: 0.26, exterior: 0.32, offsetY: -0.25 },
  seleccion: { interior: 0.37, exterior: 0.4 },
  tooltipOffset: 0.45,
  hitRadius: 0.38,
};

export const coverageSettings = {
  camara: { angulo: Math.PI / 2, alcance: 8, opacidad: 0.12 },
  pir: { angulo: Math.PI / 2, alcance: 10, opacidad: 0.2, altura: 0.035, segmentos: 40 },
  humo: { radio: 4.5, opacidad: 0.09 },
};

/**
 * Las aberturas se miden hasta su centro, desde el inicio de cada muro.
 * No hay muro en Z=3 entre X=7 y X=9, ni en Z=6 entre X=9 y X=12.
 * Mostrador y vidrio comparten planta y tienen perfiles verticales distintos.
 */
export const walls: WallSegment[] = [
  {
    id: "muro-posterior",
    desde: { x: 0, z: 0 },
    hasta: { x: 12, z: 0 },
    tipo: "muro",
    aberturas: [
      { id: "puerta-posterior", nombre: "Puerta posterior", posicion: 8, ancho: 1 },
    ],
  },
  { id: "muro-oeste", desde: { x: 0, z: 0 }, hasta: { x: 0, z: 10 }, tipo: "muro" },
  { id: "muro-este", desde: { x: 12, z: 0 }, hasta: { x: 12, z: 10 }, tipo: "muro" },
  {
    id: "muro-fachada",
    desde: { x: 0, z: 10 },
    hasta: { x: 12, z: 10 },
    tipo: "muro",
    aberturas: [
      { id: "puerta-cajeros", nombre: "Puerta zona ATM", posicion: 1.5, ancho: 1 },
      { id: "puerta-principal", nombre: "Puerta principal", posicion: 7.75, ancho: 1.5 },
    ],
  },
  { id: "division-boveda-comunicaciones", desde: { x: 3, z: 0 }, hasta: { x: 3, z: 3 }, tipo: "muro" },
  { id: "division-comunicaciones-bano", desde: { x: 5, z: 0 }, hasta: { x: 5, z: 3 }, tipo: "muro" },
  { id: "division-bano-pasillo", desde: { x: 7, z: 0 }, hasta: { x: 7, z: 3 }, tipo: "muro" },
  {
    id: "division-gerencia-plataforma-oeste",
    desde: { x: 9, z: 0 },
    hasta: { x: 9, z: 6 },
    tipo: "muro",
    aberturas: [
      { id: "puerta-gerencia", nombre: "Puerta de gerencia", posicion: 1.5, ancho: 0.9 },
      { id: "acceso-plataforma", nombre: "Acceso interno a plataforma", posicion: 4.5, ancho: 0.9 },
    ],
  },
  {
    id: "division-servicios-area-interna",
    desde: { x: 0, z: 3 },
    hasta: { x: 7, z: 3 },
    tipo: "muro",
    aberturas: [
      { id: "puerta-boveda", nombre: "Puerta de bóveda", posicion: 1.5, ancho: 1 },
      { id: "puerta-comunicaciones", nombre: "Puerta de comunicaciones", posicion: 4, ancho: 0.9 },
      { id: "puerta-bano", nombre: "Puerta de baño", posicion: 6, ancho: 0.8 },
    ],
  },
  { id: "division-gerencia-plataforma", desde: { x: 9, z: 3 }, hasta: { x: 12, z: 3 }, tipo: "muro" },
  { id: "division-area-interna-cajeros", desde: { x: 0, z: 6 }, hasta: { x: 3, z: 6 }, tipo: "muro" },
  { id: "division-cajeros-hall", desde: { x: 3, z: 6 }, hasta: { x: 3, z: 10 }, tipo: "muro" },
  { id: "mostrador-ventanillas", desde: { x: 3, z: 6 }, hasta: { x: 9, z: 6 }, tipo: "mostrador" },
  { id: "vidrio-ventanillas", desde: { x: 3, z: 6 }, hasta: { x: 9, z: 6 }, tipo: "vidrio" },
];

export const tellerWindows: TellerWindow[] = [
  { id: "V1", nombre: "Ventanilla 1", centro: { x: 4, z: 6 }, mostradorId: "mostrador-ventanillas", vidrioId: "vidrio-ventanillas" },
  { id: "V2", nombre: "Ventanilla 2", centro: { x: 6, z: 6 }, mostradorId: "mostrador-ventanillas", vidrioId: "vidrio-ventanillas" },
  { id: "V3", nombre: "Ventanilla 3", centro: { x: 8, z: 6 }, mostradorId: "mostrador-ventanillas", vidrioId: "vidrio-ventanillas" },
];

export const devices: Device[] = [
  // Cámaras: 8.
  { id: "CAM-01", tipo: "camara", nombre: "Ingreso principal", ambienteId: "hall", posicion: { x: 10.5, y: 2.6, z: 6.3 }, objetivo: { x: 7.75, y: 1.6, z: 10 } },
  { id: "CAM-02", tipo: "camara", nombre: "Hall general", ambienteId: "hall", posicion: { x: 3.3, y: 2.6, z: 9.7 }, objetivo: { x: 9, y: 1, z: 7 } },
  { id: "CAM-03", tipo: "camara", nombre: "Ventanilla 1", ambienteId: "area-interna", posicion: { x: 4, y: 2.6, z: 4.2 }, objetivo: { x: 4, y: 1.2, z: 7.5 } },
  { id: "CAM-04", tipo: "camara", nombre: "Ventanilla 2", ambienteId: "area-interna", posicion: { x: 6, y: 2.6, z: 4.2 }, objetivo: { x: 6, y: 1.2, z: 7.5 } },
  { id: "CAM-05", tipo: "camara", nombre: "Ventanilla 3", ambienteId: "area-interna", posicion: { x: 8, y: 2.6, z: 4.2 }, objetivo: { x: 8, y: 1.2, z: 7.5 } },
  { id: "CAM-06", tipo: "camara", nombre: "Bóveda", ambienteId: "boveda", posicion: { x: 0.3, y: 2.6, z: 0.3 }, objetivo: { x: 2, y: 0.8, z: 2.5 } },
  { id: "CAM-07", tipo: "camara", nombre: "Cajeros ATM", ambienteId: "cajeros", posicion: { x: 2.7, y: 2.6, z: 6.3 }, objetivo: { x: 1, y: 1.2, z: 9 } },
  { id: "CAM-08", tipo: "camara", nombre: "Puerta posterior", ambienteId: "pasillo", posicion: { x: 8.7, y: 2.6, z: 2.7 }, objetivo: { x: 8, y: 1.2, z: 0 } },

  // Sensores PIR: 7. Zonas de panel 1–7.
  { id: "PIR-01", tipo: "pir", nombre: "PIR hall", ambienteId: "hall", posicion: { x: 11.7, y: 2.5, z: 9.7 }, objetivo: { x: 6, y: 0, z: 7 }, zonaPanel: 1 },
  { id: "PIR-02", tipo: "pir", nombre: "PIR área interna", ambienteId: "area-interna", posicion: { x: 0.3, y: 2.5, z: 3.3 }, objetivo: { x: 5, y: 0, z: 5 }, zonaPanel: 2 },
  { id: "PIR-03", tipo: "pir", nombre: "PIR bóveda", ambienteId: "boveda", posicion: { x: 2.7, y: 2.5, z: 0.3 }, objetivo: { x: 1, y: 0, z: 2.5 }, zonaPanel: 3 },
  { id: "PIR-04", tipo: "pir", nombre: "PIR comunicaciones", ambienteId: "comunicaciones", posicion: { x: 3.3, y: 2.5, z: 0.3 }, objetivo: { x: 4, y: 0, z: 2.5 }, zonaPanel: 4 },
  { id: "PIR-05", tipo: "pir", nombre: "PIR pasillo", ambienteId: "pasillo", posicion: { x: 7.3, y: 2.5, z: 2.7 }, objetivo: { x: 8, y: 0, z: 0.5 }, zonaPanel: 5 },
  { id: "PIR-06", tipo: "pir", nombre: "PIR gerencia", ambienteId: "gerencia", posicion: { x: 11.7, y: 2.5, z: 0.3 }, objetivo: { x: 10, y: 0, z: 2 }, zonaPanel: 6 },
  { id: "PIR-07", tipo: "pir", nombre: "PIR plataforma", ambienteId: "plataforma", posicion: { x: 11.7, y: 2.5, z: 3.3 }, objetivo: { x: 10, y: 0, z: 5.5 }, zonaPanel: 7 },

  // Detectores de humo: 8.
  { id: "HUM-01", tipo: "humo", nombre: "Humo hall", ambienteId: "hall", posicion: { x: 7.5, y: 2.95, z: 8 } },
  { id: "HUM-02", tipo: "humo", nombre: "Humo área interna", ambienteId: "area-interna", posicion: { x: 4.5, y: 2.95, z: 4.5 } },
  { id: "HUM-03", tipo: "humo", nombre: "Humo bóveda", ambienteId: "boveda", posicion: { x: 1.5, y: 2.95, z: 1.5 } },
  { id: "HUM-04", tipo: "humo", nombre: "Humo comunicaciones", ambienteId: "comunicaciones", posicion: { x: 4, y: 2.95, z: 1.5 } },
  { id: "HUM-05", tipo: "humo", nombre: "Humo pasillo", ambienteId: "pasillo", posicion: { x: 8, y: 2.95, z: 1.5 } },
  { id: "HUM-06", tipo: "humo", nombre: "Humo gerencia", ambienteId: "gerencia", posicion: { x: 10.5, y: 2.95, z: 1.5 } },
  { id: "HUM-07", tipo: "humo", nombre: "Humo plataforma", ambienteId: "plataforma", posicion: { x: 10.5, y: 2.95, z: 4.5 } },
  { id: "HUM-08", tipo: "humo", nombre: "Humo cajeros ATM", ambienteId: "cajeros", posicion: { x: 1.5, y: 2.95, z: 8 } },

  // Contactos magnéticos: 5. Zonas de panel 8–12.
  { id: "CON-01", tipo: "contacto", nombre: "Puerta principal", ambienteId: "hall", posicion: { x: 7.75, y: 2.1, z: 10 }, zonaPanel: 8 },
  { id: "CON-02", tipo: "contacto", nombre: "Puerta de bóveda", ambienteId: "boveda", posicion: { x: 1.5, y: 2.1, z: 3 }, zonaPanel: 9 },
  { id: "CON-03", tipo: "contacto", nombre: "Puerta posterior", ambienteId: "pasillo", posicion: { x: 8, y: 2.1, z: 0 }, zonaPanel: 10 },
  { id: "CON-04", tipo: "contacto", nombre: "Puerta de comunicaciones", ambienteId: "comunicaciones", posicion: { x: 4, y: 2.1, z: 3 }, zonaPanel: 11 },
  { id: "CON-05", tipo: "contacto", nombre: "Puerta de gerencia", ambienteId: "gerencia", posicion: { x: 9, y: 2.1, z: 1.5 }, zonaPanel: 12 },

  // Pulsadores de pánico: 3. Comparten la zona 13, como indica el plan.
  { id: "PUL-01", tipo: "pulsador", nombre: "Pulsador ventanilla 1", ambienteId: "area-interna", posicion: { x: 4, y: 0.7, z: 5.6 }, zonaPanel: 13 },
  { id: "PUL-02", tipo: "pulsador", nombre: "Pulsador ventanilla 2", ambienteId: "area-interna", posicion: { x: 6, y: 0.7, z: 5.6 }, zonaPanel: 13 },
  { id: "PUL-03", tipo: "pulsador", nombre: "Pulsador ventanilla 3", ambienteId: "area-interna", posicion: { x: 8, y: 0.7, z: 5.6 }, zonaPanel: 13 },
];
