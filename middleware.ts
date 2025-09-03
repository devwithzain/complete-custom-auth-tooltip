import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
   // Clone headers and set a stable header with the client IP if available
   const requestHeaders = new Headers(req.headers);
   const clientIp = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip");
   if (clientIp) {
      requestHeaders.set("x-client-ip", clientIp);
   }
   return NextResponse.next({
      request: { headers: requestHeaders }
   });
}

// Only run where you need it. You can broaden this if desired.
export const config = {
   matcher: [
      "/api/:path*",
      "/dashboard/:path*",
      "/settings/:path*",
      "/orgs/:path*"
   ]
};