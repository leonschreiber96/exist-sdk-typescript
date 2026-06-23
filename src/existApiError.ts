export class ExistApiError extends Error {
   public readonly statusCode: number;
   public readonly body?: Record<string, unknown>;

   constructor(operation: string, statusCode: number, body?: Record<string, unknown>) {
      const detail = body?.detail ?? body?.error ?? body?.message;
      const bodyMsg = detail ? `: ${detail}` : body ? ` — ${JSON.stringify(body)}` : "";
      super(`${operation} failed with HTTP ${statusCode}${bodyMsg}`);
      this.name = "ExistApiError";
      this.statusCode = statusCode;
      this.body = body;
   }
}
