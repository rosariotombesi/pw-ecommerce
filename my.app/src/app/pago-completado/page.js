import { Suspense } from "react";
import PagoCompletadoClient from "./pago-completado-client";

export default function PagoCompletadoPage() {
  return (
    <Suspense fallback={<p className="empty-state">Confirmando pago...</p>}>
      <PagoCompletadoClient />
    </Suspense>
  );
}
