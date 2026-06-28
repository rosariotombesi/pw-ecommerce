import handler from "../../../../server/api/pagos/confirmar";
import { runPagesHandler } from "../../../../lib/routeHandlerAdapter";

export function POST(request) {
  return runPagesHandler(handler, request);
}
