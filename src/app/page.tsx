import { MousePointer2 } from "lucide-react";
import TopBar from "@/components/ui/TopBar";
import SecurityWorkspace from "@/components/ui/SecurityWorkspace";
import { agency, devices, rooms } from "@/data/agencia-demo";

export default function Home() {
  return (
    <main className="app-shell">
      <TopBar />
      <section className="project-strip" aria-label="Información de la agencia">
        <div className="project-name"><span className="project-code">AG / 001</span><span>Agencia de demostración</span><span className="demo-badge">Plano ficticio</span></div>
        <div className="project-metrics"><span><strong>{agency.ancho * agency.fondo}</strong> m²</span><span><strong>{rooms.length}</strong> ambientes</span><span><strong>{devices.length}</strong> dispositivos</span></div>
      </section>
      <SecurityWorkspace />
      <footer className="viewer-footer">
        <p><MousePointer2 size={14} /> Arrastra para girar <span>·</span> Rueda o pellizco para acercar <span>·</span> Esc para deseleccionar</p>
        <p>Plano ficticio <span>·</span> Medidas en metros</p>
      </footer>
    </main>
  );
}
