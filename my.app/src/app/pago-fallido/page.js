import { Suspense } from "react";
import PagoFallidoClient from "./pago-fallido-client";

export default function PagoFallidoPage() {
  return (
    <Suspense fallback={<p className="empty-state">Cargando resultado...</p>}>
      <PagoFallidoClient />
    </Suspense>
  );
}
