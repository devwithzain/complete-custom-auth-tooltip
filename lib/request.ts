export function getUserAgent(req: Request) {
   return req.headers.get("user-agent") || undefined;
}

// Try several common headers. Use the first public-looking IP from x-forwarded-for.
// Falls back to custom header set by middleware (x-client-ip).
export function getClientIp(req: Request) {
   // Cloudflare
   const cf = req.headers.get("cf-connecting-ip");
   if (cf) return cf;

   // Vercel’s forwarded list or any reverse proxy chain
   const xff = req.headers.get("x-forwarded-for");
   if (xff) {
      // Take first IP; strip spaces
      const first = xff.split(",")[0]?.trim();
      if (first) return first;
   }

   // Nginx/Heroku/Fly
   const real = req.headers.get("x-real-ip");
   if (real) return real;

   // Middleware-propagated IP (see middleware.ts below)
   const client = req.headers.get("x-client-ip");
   if (client) return client;

   // Other vendor-specific headers if you ever use them
   const fastly = req.headers.get("fastly-client-ip");
   if (fastly) return fastly;

   const trueClient = req.headers.get("true-client-ip");
   if (trueClient) return trueClient;

   // If nothing is present, return undefined
   return undefined;
}