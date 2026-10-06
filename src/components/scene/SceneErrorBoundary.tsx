"use client";

import { Component, type ReactNode } from "react";

export default class SceneErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (this.state.failed) return (
      <div className="scene-error" role="alert"><h2>No se pudo iniciar la vista 3D</h2><p>Comprueba que la aceleración gráfica esté disponible. Puedes seguir consultando los equipos y registrando pruebas desde el inventario.</p><button onClick={() => this.setState({ failed: false })}>Reintentar vista 3D</button></div>
    );
    return this.props.children;
  }
}
