import handler from "../../../../server/api/pagos/crear-preferencia";
import { runPagesHandler } from "../../../../lib/routeHandlerAdapter";

export function POST(request) {
  return runPagesHandler(handler, request);
}
