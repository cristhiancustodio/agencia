# Mapa de seguridad de agencia

Demo interactiva de una agencia bancaria **ficticia**, desarrollada directamente en `F:\agencia`. Fases 0–6 implementadas para uso local. La publicación queda a cargo del usuario, según su última indicación.

## Ejecutar

Entorno verificado: Node.js 24 y npm 12.

```powershell
npm ci
npm run dev
```

Abrir <http://localhost:3000>. **No se necesitan variables de entorno ni servicios externos.**

```powershell
npm run lint
npm test
npm run build
npm start
```

## Funciones

- Plano 3D de 120 m² con 9 ambientes, puertas, mostrador, vidrio, sombras y etiquetas.
- Vistas isométrica y planta, rotación, zoom y muros completos de 3 m o recortados de 1.2 m.
- 31 dispositivos: 8 cámaras, 7 PIR, 8 detectores de humo, 5 contactos y 3 pulsadores.
- Iconos orientados, etiquetas al pasar el cursor, filtros, inventario y fichas con acercamiento de cámara.
- Coberturas independientes: cámaras (90°, 8 m), PIR (90°, 10 m) y humo (radio 4.5 m).
- Modo prueba con resultados OK/Falla, observaciones, fecha automática, avance y reinicio con confirmación.
- Guardado local, pulso y bloom para fallas, carga inicial, recuperación de errores WebGL e interfaz adaptable con ficha inferior en móvil.
- Respeta movimiento reducido. Esc, cerrar ficha o pulsar el fondo deselecciona.

## Uso y persistencia

Seleccionar un equipo en el plano o inventario. Activar **Modo prueba**, escribir una observación opcional y pulsar **OK** o **Falla** para guardar ambos datos. El resumen cuenta siempre los 31 equipos, aunque haya filtros. **Reiniciar prueba** borra resultados, fechas y observaciones tras confirmar.

Los resultados se guardan en localStorage, clave `agencia-demo-walk-test`. Permanecen al recargar el mismo navegador y origen; no se sincronizan entre equipos, navegadores, puertos ni dominios. Borrar datos del sitio elimina el recorrido. Si el almacenamiento está bloqueado, la interfaz avisa y permite trabajar durante la sesión. No hay backend ni autenticación.

## Datos y convenciones

`src/data/agencia-demo.ts` centraliza plano, dimensiones, dispositivos y configuración visual. Unidades en metros: X recorre el ancho, Z va del fondo a la fachada y Y indica altura. Origen en la esquina posterior izquierda; fachada en Z = 10.

`DoorOpening.posicion` mide desde el inicio del muro hasta el centro de la abertura. Las puertas usan una altura asumida de 2.2 m porque el plan solo especifica anchos. Mostrador y vidrio cubren 0–1.1 m y 1.1–2.2 m. Los tres pulsadores comparten la zona de panel 13.

Las coberturas son geométricas orientativas: cámaras y humo no consideran obstáculos; los PIR se recortan al rectángulo de su ambiente. No certifican cobertura real. Todos los datos son ficticios.

## Estructura

- `src/components/scene/`: plano, cámara, símbolos, coberturas y efectos 3D.
- `src/components/ui/`: controles, inventario, ficha, formulario y resumen.
- `src/store/useSecurityStore.ts`: estado y persistencia validada.
- `src/lib/`: geometría, orientación, colores y validación de registros.
- `tests/`: 15 pruebas de aberturas, orientación, recorte, persistencia y recuperación ante datos inválidos.
- `PLAN.md`, `CLAUDE.md`, `AGENTS.md`: requisitos y reglas compartidas.

## Verificación

Build de producción y TypeScript correctos; 15 pruebas automáticas aprobadas. Auditoría de producción sin vulnerabilidades reportadas. La cadena de ESLint tiene avisos de desarrollo en braces; no se fuerza una regresión de versión mayor de Next para resolverlos.

## Publicación opcional

Cuando se desee publicar desde esta raíz:

```powershell
npx vercel login
npx vercel deploy --prod
```

Seleccionar framework Next.js y conservar los comandos detectados. No configurar variables de entorno. `.vercelignore` excluye documentación, pruebas, archivos de entorno y dependencias locales. No se realizó ninguna publicación.

Las ideas de la sección 9 (backend, editor, IA, PDF y múltiples agencias) quedan fuera del prototipo.
