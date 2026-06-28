import {
  errorResponse,
  obtenerRolUsuario,
  obtenerUsuario,
  successResponse,
} from "../../../lib/apiHelpers";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return errorResponse(res, 405, "Método no permitido", "METHOD_NOT_ALLOWED");
  }

  try {
    const { supabase, user } = await obtenerUsuario(req);

    if (!user) {
      return successResponse(res, {
        autenticado: false,
        email: null,
        rol: null,
      });
    }

    const rol = await obtenerRolUsuario(supabase, user);

    return successResponse(res, {
      autenticado: true,
      email: user.email,
      rol: rol || "cliente",
    });
  } catch (error) {
    return errorResponse(res, 500, "Error al obtener rol", "ROLE_READ_ERROR");
  }
}
