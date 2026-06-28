import { Suspense } from "react";
import PagoPendienteClient from "./pago-pendiente-client";

export default function PagoPendientePage() {
  return (
    <Suspense fallback={<p className="empty-state">Cargando resultado...</p>}>
      <PagoPendienteClient />
    </Suspense>
  );
}
