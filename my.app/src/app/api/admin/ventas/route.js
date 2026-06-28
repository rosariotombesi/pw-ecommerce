import handler from "../../../../server/api/admin/ventas";
import { runPagesHandler } from "../../../../lib/routeHandlerAdapter";

export function GET(request) {
  return runPagesHandler(handler, request);
}
