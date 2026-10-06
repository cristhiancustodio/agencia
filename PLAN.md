# PLAN.md — Prototipo 3D: Mapa de Seguridad de Agencia Bancaria

> Este archivo es la guía para Claude Code. Colócalo en la raíz del proyecto.
> Ejecuta **una fase a la vez** y detente al terminar cada una para revisión.

---

## 1. Contexto del proyecto

Prototipo web que muestra una **agencia bancaria pequeña en 3D** con sus dispositivos de seguridad
(cámaras, sensores PIR, detectores de humo, contactos magnéticos de puerta y pulsadores de pánico).

Objetivo: reemplazar el croquis impreso que usan los técnicos de mantenimiento por un plano interactivo
donde se vea la ubicación, la cobertura y el estado de cada dispositivo, con una estética tipo
**juego de estrategia** (vista isométrica, colores claros de estado, interfaz limpia).

Usuario final del prototipo: supervisor o técnico de mantenimiento de seguridad.
Uso inmediato: demo visual para validar la idea con empresas de mantenimiento.

**El plano es ficticio.** Nunca usar planos reales de agencias en demos públicas.

---

## 2. Stack tecnológico

| Capa | Tecnología | Uso |
|---|---|---|
| Framework | Next.js (última estable, App Router) + TypeScript | Base del proyecto |
| 3D | `three` + `@react-three/fiber` | Renderizado 3D con componentes React |
| Utilidades 3D | `@react-three/drei` | OrbitControls, Html (etiquetas), Edges, Grid, cámaras |
| Estado | `zustand` (con middleware `persist`) | Dispositivo seleccionado, filtros, estados de prueba |
| Estilos | Tailwind CSS | Interfaz (panel lateral, leyenda, barra superior) |
| Íconos UI | `lucide-react` | Íconos de la interfaz 2D |
| Efectos (Fase 6) | `@react-three/postprocessing` | Brillo (bloom) en dispositivos con falla |
| Deploy | Vercel | Publicar la demo |

Sin backend en esta etapa. Los datos viven en un archivo TypeScript y el progreso de pruebas
se guarda en `localStorage` mediante `zustand/persist`.

---

## 3. Reglas para Claude Code

- Unidades: **metros**. Eje X = ancho (oeste → este), eje Z = profundidad (fondo → fachada), eje Y = altura.
- Origen (0, 0, 0) en la esquina posterior izquierda del local. La fachada está en Z = 10.
- Todos los datos del plano y dispositivos se definen en `src/data/agencia-demo.ts`. Ningún componente
  debe tener coordenadas escritas a mano.
- Componentes 3D en `src/components/scene/`, interfaz 2D en `src/components/ui/`.
- El `<Canvas>` de R3F va en un componente cliente (`'use client'`) cargado con `next/dynamic` y `ssr: false`.
- Geometrías simples (cajas, cilindros, conos). No usar modelos `.glb` por ahora.
- Textos de la interfaz en español.
- Código tipado, sin `any`. Componentes pequeños y reutilizables.
- Al terminar cada fase: verificar que `npm run build` compile sin errores.

---

## 4. Estructura de carpetas

```
mapa-seguridad-agencia/
├── PLAN.md
├── CLAUDE.md                     ← resumen corto de las reglas de la sección 3
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx              ← compone Escena + UI
│   │   └── globals.css
│   ├── components/
│   │   ├── scene/
│   │   │   ├── SceneCanvas.tsx   ← Canvas, luces, cámara, controles
│   │   │   ├── FloorPlan.tsx     ← piso y ambientes
│   │   │   ├── Wall.tsx          ← muro con huecos de puerta
│   │   │   ├── RoomLabel.tsx     ← nombre del ambiente
│   │   │   ├── devices/
│   │   │   │   ├── DeviceMarker.tsx    ← elige el ícono según el tipo
│   │   │   │   ├── CameraIcon.tsx
│   │   │   │   ├── PirIcon.tsx
│   │   │   │   ├── SmokeIcon.tsx
│   │   │   │   ├── ContactIcon.tsx
│   │   │   │   └── PanicIcon.tsx
│   │   │   └── coverage/
│   │   │       ├── CameraCone.tsx
│   │   │       ├── PirFan.tsx
│   │   │       └── SmokeRadius.tsx
│   │   └── ui/
│   │       ├── TopBar.tsx         ← título, cambio de vista, modo prueba
│   │       ├── FilterPanel.tsx    ← mostrar/ocultar por tipo y coberturas
│   │       ├── DevicePanel.tsx    ← ficha del dispositivo seleccionado
│   │       ├── Legend.tsx
│   │       └── TestSummary.tsx    ← resumen OK / falla / pendiente
│   ├── data/
│   │   └── agencia-demo.ts
│   ├── store/
│   │   └── useSecurityStore.ts
│   ├── types/
│   │   └── index.ts
│   └── lib/
│       ├── deviceStyles.ts        ← colores y nombres por tipo
│       └── geometry.ts            ← helpers (orientación hacia un objetivo, etc.)
└── package.json
```

---

## 5. Modelo de datos (`src/types/index.ts`)

```ts
export type DeviceType = 'camara' | 'pir' | 'humo' | 'contacto' | 'pulsador';
export type TestStatus = 'pendiente' | 'ok' | 'falla';

export interface Vec3 { x: number; y: number; z: number; }

export interface Room {
  id: string;
  nombre: string;
  x: number; z: number;        // esquina superior izquierda
  ancho: number; fondo: number;
  color: string;               // color del piso
  restringido?: boolean;       // zonas de acceso restringido (bóveda, comunicaciones)
}

export interface DoorOpening {
  id: string;
  nombre: string;
  posicion: number;            // posición a lo largo del muro (desde el inicio)
  ancho: number;
}

export interface WallSegment {
  id: string;
  desde: { x: number; z: number };
  hasta: { x: number; z: number };
  aberturas?: DoorOpening[];
  tipo?: 'muro' | 'mostrador' | 'vidrio';
}

export interface Device {
  id: string;                  // ej. "CAM-01"
  tipo: DeviceType;
  nombre: string;
  ambienteId: string;
  posicion: Vec3;
  objetivo?: Vec3;             // hacia dónde apunta (cámaras y PIR)
  zonaPanel?: number;          // zona en la central de alarma
  marca?: string;
  notas?: string;
}

export interface TestRecord {
  estado: TestStatus;
  fecha?: string;              // ISO
  observacion?: string;
}
```

---

## 6. Plano de la agencia (12 m × 10 m, altura de muros 3 m)

### Distribución

```
 Z=0  ┌────────┬───────┬───────┬────────┬──────────────┐  ← muro posterior (puerta posterior en x≈8)
      │ BÓVEDA │ COMUN.│ BAÑO  │PASILLO │   GERENCIA   │
      │ 0–3    │ 3–5   │ 5–7   │ 7–9    │   9–12       │
 Z=3  ├──┤├────┴──┤├───┴──┤├───┘        ├──────────────┤
      │                                 │              │
      │      ÁREA INTERNA VENTANILLAS   ├┤ PLATAFORMA  │
      │            0–9                  │   9–12       │
 Z=6  ├────────┬==V1====V2====V3==──────┘              │  ← mostrador con 3 ventanillas
      │CAJEROS │                                       │
      │  ATM   │            HALL DE CLIENTES           │
      │  0–3   │               3–12                    │
 Z=10 └──┤├────┴──────────────┤ PUERTA ├───────────────┘  ← fachada
```

### Ambientes (`rooms`)

| id | Nombre | x | z | ancho | fondo | Restringido |
|---|---|---|---|---|---|---|
| boveda | Bóveda / Tesorería | 0 | 0 | 3 | 3 | sí |
| comunicaciones | Cuarto de comunicaciones | 3 | 0 | 2 | 3 | sí |
| bano | Baño | 5 | 0 | 2 | 3 | no |
| pasillo | Pasillo de servicio | 7 | 0 | 2 | 3 | no |
| gerencia | Oficina de gerencia | 9 | 0 | 3 | 3 | no |
| area-interna | Área interna de ventanillas | 0 | 3 | 9 | 3 | sí |
| plataforma | Plataforma de atención | 9 | 3 | 3 | 3 | no |
| cajeros | Zona de cajeros ATM | 0 | 6 | 3 | 4 | no |
| hall | Hall de clientes | 3 | 6 | 9 | 4 | no |

### Puertas y aberturas

| id | Nombre | Muro | Centro aprox. | Ancho |
|---|---|---|---|---|
| puerta-principal | Puerta principal | fachada (Z=10) | x = 7.75 | 1.5 |
| puerta-cajeros | Puerta zona ATM | fachada (Z=10) | x = 1.5 | 1.0 |
| puerta-boveda | Puerta de bóveda | Z=3 | x = 1.5 | 1.0 |
| puerta-comunicaciones | Puerta de comunicaciones | Z=3 | x = 4.0 | 0.9 |
| puerta-bano | Puerta de baño | Z=3 | x = 6.0 | 0.8 |
| puerta-gerencia | Puerta de gerencia | X=9 | z = 1.5 | 0.9 |
| puerta-posterior | Puerta posterior | Z=0 | x = 8.0 | 1.0 |
| acceso-plataforma | Acceso interno a plataforma | X=9 | z = 4.5 | 0.9 |

Notas:
- El pasillo está abierto hacia el área interna (sin muro en Z=3 entre x=7 y x=9).
- La plataforma está abierta hacia el hall (sin muro en Z=6 entre x=9 y x=12).
- El tramo Z=6 entre x=3 y x=9 es un **mostrador** (altura 1.1 m, tipo `mostrador`) con un vidrio
  de seguridad encima (tipo `vidrio`, semitransparente) hasta 2.2 m.
- Ventanillas centradas en x = 4, 6 y 8.

---

## 7. Dispositivos

Alturas de referencia: cámaras 2.6 m, PIR 2.5 m, detectores de humo en techo 2.95 m,
contactos magnéticos 2.1 m (marco superior de la puerta), pulsadores 0.7 m (debajo del mostrador).

### Cámaras

| id | Nombre | Ambiente | Posición (x, y, z) | Objetivo (x, y, z) |
|---|---|---|---|---|
| CAM-01 | Ingreso principal | hall | (10.5, 2.6, 6.3) | (7.75, 1.6, 10) |
| CAM-02 | Hall general | hall | (3.3, 2.6, 9.7) | (9, 1, 7) |
| CAM-03 | Ventanilla 1 | area-interna | (4, 2.6, 4.2) | (4, 1.2, 7.5) |
| CAM-04 | Ventanilla 2 | area-interna | (6, 2.6, 4.2) | (6, 1.2, 7.5) |
| CAM-05 | Ventanilla 3 | area-interna | (8, 2.6, 4.2) | (8, 1.2, 7.5) |
| CAM-06 | Bóveda | boveda | (0.3, 2.6, 0.3) | (2, 0.8, 2.5) |
| CAM-07 | Cajeros ATM | cajeros | (2.7, 2.6, 6.3) | (1, 1.2, 9) |
| CAM-08 | Puerta posterior | pasillo | (8.7, 2.6, 2.7) | (8, 1.2, 0) |

### Sensores PIR

| id | Nombre | Ambiente | Posición | Objetivo | Zona panel |
|---|---|---|---|---|---|
| PIR-01 | PIR hall | hall | (11.7, 2.5, 9.7) | (6, 0, 7) | 1 |
| PIR-02 | PIR área interna | area-interna | (0.3, 2.5, 3.3) | (5, 0, 5) | 2 |
| PIR-03 | PIR bóveda | boveda | (2.7, 2.5, 0.3) | (1, 0, 2.5) | 3 |
| PIR-04 | PIR comunicaciones | comunicaciones | (3.3, 2.5, 0.3) | (4, 0, 2.5) | 4 |
| PIR-05 | PIR pasillo | pasillo | (7.3, 2.5, 2.7) | (8, 0, 0.5) | 5 |
| PIR-06 | PIR gerencia | gerencia | (11.7, 2.5, 0.3) | (10, 0, 2) | 6 |
| PIR-07 | PIR plataforma | plataforma | (11.7, 2.5, 3.3) | (10, 0, 5.5) | 7 |

### Detectores de humo

| id | Ambiente | Posición |
|---|---|---|
| HUM-01 | hall | (7.5, 2.95, 8) |
| HUM-02 | area-interna | (4.5, 2.95, 4.5) |
| HUM-03 | boveda | (1.5, 2.95, 1.5) |
| HUM-04 | comunicaciones | (4, 2.95, 1.5) |
| HUM-05 | pasillo | (8, 2.95, 1.5) |
| HUM-06 | gerencia | (10.5, 2.95, 1.5) |
| HUM-07 | plataforma | (10.5, 2.95, 4.5) |
| HUM-08 | cajeros | (1.5, 2.95, 8) |

### Contactos magnéticos (sensores de apertura)

| id | Puerta | Posición | Zona panel |
|---|---|---|---|
| CON-01 | Puerta principal | (7.75, 2.1, 10) | 8 |
| CON-02 | Puerta de bóveda | (1.5, 2.1, 3) | 9 |
| CON-03 | Puerta posterior | (8, 2.1, 0) | 10 |
| CON-04 | Puerta de comunicaciones | (4, 2.1, 3) | 11 |
| CON-05 | Puerta de gerencia | (9, 2.1, 1.5) | 12 |

### Pulsadores de pánico (sección de ventanillas)

| id | Nombre | Posición | Zona panel |
|---|---|---|---|
| PUL-01 | Pulsador ventanilla 1 | (4, 0.7, 5.6) | 13 |
| PUL-02 | Pulsador ventanilla 2 | (6, 0.7, 5.6) | 13 |
| PUL-03 | Pulsador ventanilla 3 | (8, 0.7, 5.6) | 13 |

### Colores por tipo (`lib/deviceStyles.ts`)

| Tipo | Color | Forma del ícono |
|---|---|---|
| Cámara | Azul `#3B82F6` | Caja pequeña con cilindro (lente) orientada al objetivo |
| PIR | Morado `#A855F7` | Media esfera / domo pegado a la esquina |
| Humo | Gris claro `#E5E7EB` | Cilindro plano en el techo |
| Contacto | Ámbar `#F59E0B` | Dos cajitas paralelas en el marco |
| Pulsador | Rojo `#EF4444` | Cilindro corto con botón |

Estados de prueba (sobrescriben el color del anillo indicador):
pendiente = gris `#9CA3AF`, ok = verde `#22C55E`, falla = rojo `#EF4444` con pulso animado.

---

## 8. Fases de desarrollo

### Fase 0 — Configuración

- Crear el proyecto con `npx create-next-app@latest` (TypeScript, Tailwind, App Router, carpeta `src`).
- Instalar `three @react-three/fiber @react-three/drei zustand lucide-react` y `@types/three`.
- Crear la estructura de carpetas de la sección 4 y el archivo `CLAUDE.md`.
- Crear `types/index.ts` y `data/agencia-demo.ts` con **todos** los datos de las secciones 6 y 7.

**Listo cuando:** compila y los datos están completos y tipados.

### Fase 1 — Plano 3D

- `SceneCanvas` con fondo oscuro neutro, luz ambiental + direccional con sombras suaves.
- Cámara inicial isométrica mirando al centro (6, 0, 5); `OrbitControls` con límites
  (no pasar por debajo del piso, zoom mínimo y máximo).
- `FloorPlan`: un plano por ambiente con su color (tonos suaves, restringidos con tono más cálido).
- `Wall`: muros de 0.15 m de grosor y 3 m de alto con huecos donde hay puertas; mostrador
  y vidrio según la sección 6. Bordes marcados con `<Edges>`.
- `RoomLabel`: nombre de cada ambiente sobre el piso usando `Html` de drei.
- Botón para alternar **altura de muros**: completa (3 m) / recortada (1.2 m, estilo maqueta)
  para ver mejor el interior.
- Botones de vista: **Isométrica** y **Planta (desde arriba)**, con transición suave de cámara.

**Listo cuando:** se ve la agencia completa, se puede rotar y cambiar de vista.

### Fase 2 — Dispositivos

- `DeviceMarker` recorre la lista de dispositivos y renderiza el ícono según el tipo.
- Cámaras y PIR orientados hacia su `objetivo` (helper en `lib/geometry.ts`).
- Al pasar el cursor: el dispositivo se agranda un poco y aparece una etiqueta con su id y nombre.
- Cada dispositivo tiene debajo un pequeño anillo del color de su estado de prueba.

**Listo cuando:** los 31 dispositivos aparecen en su lugar y con su forma y color.

### Fase 3 — Coberturas

- `CameraCone`: cono semitransparente desde la cámara hacia el objetivo. Campo de visión 90°,
  alcance 8 m. Material con `transparent`, `opacity ~0.15`, `depthWrite: false`.
- `PirFan`: abanico en el piso (geometría circular con `thetaLength` de 90°, radio 10 m),
  recortado visualmente a la sala con opacidad baja.
- `SmokeRadius`: círculo tenue en el techo con radio de 4.5 m.
- Interruptores en `FilterPanel` para mostrar/ocultar cada tipo de cobertura.

**Listo cuando:** se pueden activar las coberturas y se distinguen las zonas sin cubrir.

### Fase 4 — Interacción y fichas

- Clic en un dispositivo → se selecciona, la cámara se acerca suavemente y se abre `DevicePanel`
  con: id, tipo, nombre, ambiente, zona del panel, estado de prueba, fecha de última prueba y notas.
- `FilterPanel`: mostrar/ocultar dispositivos por tipo, con contador por tipo.
- `Legend`: colores y formas de cada tipo.
- Tecla `Esc` o clic en el vacío deselecciona.

**Listo cuando:** se puede explorar cada dispositivo y filtrar por tipo.

### Fase 5 — Modo prueba de recorrido (walk test)

- Botón en `TopBar` para activar el **modo prueba**.
- En este modo, al seleccionar un dispositivo el panel muestra botones **OK** y **Falla**
  y un campo de observación. Se guarda fecha y hora automáticamente.
- El anillo cambia de color; los dispositivos con falla pulsan en rojo.
- `TestSummary`: barra con totales (OK / falla / pendiente) y porcentaje de avance.
- Botón para reiniciar la prueba (con confirmación).
- Persistencia en `localStorage` con `zustand/persist`.

**Listo cuando:** se puede hacer una prueba completa, recargar la página y conservar el avance.

### Fase 6 — Pulido visual y despliegue

- Estética "juego de estrategia": paleta consistente, sombras, bloom suave en dispositivos con falla
  (`@react-three/postprocessing`), animación de entrada de la escena.
- Interfaz responsive (en móvil, el panel lateral pasa a hoja inferior).
- Pantalla de carga mientras se monta la escena.
- Desplegar en Vercel.

**Listo cuando:** la demo se ve bien en escritorio y celular y tiene enlace público.

---

## 9. Ideas para después del prototipo (no implementar ahora)

- Supabase: varias agencias, historial de pruebas, usuarios técnico/supervisor.
- Editor: arrastrar dispositivos sobre el plano y crear ambientes desde la interfaz.
- IA (visión): subir la foto del croquis impreso y generar el plano y los dispositivos automáticamente.
- IA (comandos): "muéstrame los PIR con falla" o "agrega una cámara en la bóveda" usando Vercel AI SDK.
- Reporte PDF de la visita de mantenimiento.
- Vista general con todas las agencias de un cliente y su estado.
- Códigos QR por dispositivo para abrir su ficha desde el celular.

---

## 10. Cómo usar este plan con Claude Code

1. Crea la carpeta `mapa-seguridad-agencia`, coloca este `PLAN.md` dentro y abre Claude Code ahí.
2. Primer mensaje sugerido:

   > Lee PLAN.md completo. Ejecuta solo la Fase 0. Al terminar, muéstrame un resumen de lo creado
   > y detente para que lo revise.

3. Para cada fase siguiente:

   > Ejecuta la Fase N de PLAN.md. Respeta las reglas de la sección 3. Al terminar verifica
   > con `npm run build` y detente.

4. Si algo no se ve como esperas, pide ajustes concretos antes de pasar a la siguiente fase.
