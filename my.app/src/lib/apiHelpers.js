import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const adminEmails = (process.env.SUPABASE_ADMIN_EMAILS || "")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

export const tieneSupabaseServiceRole = Boolean(supabaseServiceRoleKey);

export function successResponse(res, data, status = 200) {
  return res.status(status).json({
    success: true,
    data,
  });
}

export function errorResponse(res, status, error, code = "API_ERROR") {
  return res.status(status).json({
    success: false,
    error,
    code,
  });
}

export function crearSupabaseCliente(req) {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
    },
    global: {
      headers: {
        Authorization: req.headers.authorization || "",
      },
    },
  });
}

export function crearSupabaseAdmin(req) {
  if (!supabaseServiceRoleKey) {
    return crearSupabaseCliente(req);
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
    },
  });
}

export async function obtenerUsuario(req) {
  const supabase = crearSupabaseCliente(req);
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { supabase, user: null };
  }

  return { supabase, user };
}

export async function obtenerRolUsuario(supabase, user) {
  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from("usuarios")
    .select("rol")
    .eq("id", user.id)
    .single();

  if (error) {
    return null;
  }

  return data?.rol || null;
}

export async function esAdmin(supabase, user) {
  const rol = await obtenerRolUsuario(supabase, user);

  return (
    rol === "admin" ||
    Boolean(user?.email && adminEmails.includes(user.email.toLowerCase()))
  );
}

export function validarCantidad(cantidad) {
  return Number.isInteger(cantidad) && cantidad > 0 && cantidad <= 100;
}

export function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export function sanitizar(str) {
  return String(str)
    .replace(/<\/?[^>]+/g, "")
    .trim()
    .substring(0, 255);
}
