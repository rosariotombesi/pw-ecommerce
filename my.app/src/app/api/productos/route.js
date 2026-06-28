import handler from "../../../server/api/productos";
import { runPagesHandler } from "../../../lib/routeHandlerAdapter";

export function GET(request) {
  return runPagesHandler(handler, request);
}
