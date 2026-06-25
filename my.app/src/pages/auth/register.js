import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/router";

export default function Register() {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setError(error.message);
        return;
      }

      const userId = data.user?.id;

      if (userId) {
        const { error: profileError } = await supabase.from("usuarios").insert([
          {
            id: userId,
            email,
            nombre,
            apellido,
            rol: "cliente",
          },
        ]);

        if (profileError) {
          setError(profileError.message);
          return;
        }
      }

      setMensaje("Cuenta creada correctamente. Revisa tu email para confirmar la cuenta.");

      setTimeout(() => {
        router.push("/auth/login");
      }, 1500);
    } catch (err) {
      setError("Error al registrar usuario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className="auth-form">
      <h1>Crear cuenta</h1>

      {error && <p>{error}</p>}
      {mensaje && <p>{mensaje}</p>}

      <input
        type="text"
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
      />

      <input
        type="text"
        placeholder="Apellido"
        value={apellido}
        onChange={(e) => setApellido(e.target.value)}
        required
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Contrasena"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button type="submit" disabled={loading}>
        {loading ? "Creando cuenta..." : "Registrarse"}
      </button>
    </form>
  );
}
