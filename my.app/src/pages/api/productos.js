import { supabase } from "../../lib/supabase";
import { adaptarProducto } from "../../lib/productos";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      error: "Metodo no permitido",
    });
  }

  try {
    const { data, error } = await supabase
      .from("productos")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      data: data.map(adaptarProducto),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Error al obtener productos",
    });
  }
}
