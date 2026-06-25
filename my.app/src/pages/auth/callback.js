import { useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../lib/supabase";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const confirmarSesion = async () => {
      await supabase.auth.getSession();
      router.replace("/");
    };

    confirmarSesion();
  }, [router]);

  return <p>Confirmando sesion...</p>;
}
