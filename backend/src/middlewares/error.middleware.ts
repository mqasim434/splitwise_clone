import type { ErrorRequestHandler, RequestHandler } from "express";

export const notFound: RequestHandler = (req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
};

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  // malformed JSON sent by a client
  if (err instanceof SyntaxError && "body" in err) {
    res.status(400).json({ message: "Invalid JSON in request body" });
    return;
  }

  // body bigger than the limit
  if (err?.type === "entity.too.large") {
    res.status(413).json({ message: "Request body too large" });
    return;
  }

  // anything unexpected: log it for us, say nothing about internals to the client
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
};