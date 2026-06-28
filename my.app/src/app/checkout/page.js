import { Suspense } from "react";
import CheckoutClient from "./checkout-client";

export default function CheckoutPage() {
  return (
    <Suspense fallback={<p className="empty-state">Cargando checkout...</p>}>
      <CheckoutClient />
    </Suspense>
  );
}
