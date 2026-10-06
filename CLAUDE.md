# Reglas del proyecto

Estas reglas se aplican a Codex y a cualquier otro asistente que trabaje aquí.

- Leer `PLAN.md`. Ejecutar únicamente la fase solicitada y detenerse al terminar para revisión.
- Trabajar en esta raíz (`F:\agencia`), sin crear otra carpeta contenedora del proyecto.
- Usar metros: X = oeste → este, Z = fondo → fachada, Y = altura. Origen en la esquina posterior izquierda; fachada en Z = 10.
- Centralizar todos los datos del plano, medidas, posiciones y dispositivos en `src/data/agencia-demo.ts`. No escribir coordenadas en componentes.
- Componentes 3D en `src/components/scene/`; interfaz 2D en `src/components/ui/`.
- Al implementar la Fase 1, montar el Canvas de R3F en un componente cliente (`'use client'`) cargado mediante `next/dynamic` con `ssr: false` desde otro componente cliente.
- Usar geometrías simples (cajas, cilindros, conos), sin modelos `.glb`.
- Interfaz en español; TypeScript estricto, sin `any`; componentes pequeños y reutilizables.
- Usar únicamente el plano ficticio del plan, nunca datos de agencias reales.
- Sin backend. Implementar la persistencia con Zustand/localStorage cuando corresponda a la fase solicitada.
- Al terminar cada fase, ejecutar `npm run build`, resumir lo creado y detenerse.

Se trabaja una fase por solicitud. Los módulos reservados se implementan únicamente cuando corresponda a la fase autorizada.
