import handler from "../../../server/api/ordenes";
import { runPagesHandler } from "../../../lib/routeHandlerAdapter";

export function GET(request) {
  return runPagesHandler(handler, request);
}

export function POST(request) {
  return runPagesHandler(handler, request);
}
