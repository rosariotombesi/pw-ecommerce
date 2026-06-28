"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const confirmarSesion = async () => {
      await supabase.auth.getSession();
      router.replace("/");
    };

    confirmarSesion();
  }, [router]);

  return <p>Confirmando sesión...</p>;
}
