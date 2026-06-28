function headersToObject(headers) {
  const result = {};
  headers.forEach((value, key) => {
    result[key] = value;
  });
  return result;
}

async function requestBody(request) {
  if (request.method === "GET" || request.method === "HEAD") {
    return {};
  }

  const text = await request.text();

  if (!text) {
    return {};
  }

  const contentType = request.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    return text;
  }

  try {
    return JSON.parse(text);
  } catch {
    return {
      __invalidJson: true,
    };
  }
}

export async function runPagesHandler(handler, request, context = {}) {
  const body = await requestBody(request);

  if (body && body.__invalidJson) {
    return Response.json(
      {
        success: false,
        error: "JSON inválido",
        code: "INVALID_JSON",
      },
      { status: 400 }
    );
  }

  const url = new URL(request.url);
  const params = context.params ? await context.params : {};
  const responseHeaders = new Headers();
  let statusCode = 200;

  const req = {
    method: request.method,
    headers: headersToObject(request.headers),
    body,
    query: {
      ...Object.fromEntries(url.searchParams.entries()),
      ...params,
    },
  };

  const res = {
    status(code) {
      statusCode = code;
      return res;
    },
    setHeader(name, value) {
      responseHeaders.set(
        name,
        Array.isArray(value) ? value.join(", ") : String(value)
      );
      return res;
    },
    json(payload) {
      responseHeaders.set("content-type", "application/json; charset=utf-8");
      return new Response(JSON.stringify(payload), {
        status: statusCode,
        headers: responseHeaders,
      });
    },
    end(payload = "") {
      return new Response(payload, {
        status: statusCode,
        headers: responseHeaders,
      });
    },
  };

  return handler(req, res);
}
