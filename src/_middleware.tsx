import { NextResponse } from "next/server";

export function middleware() {
  const ContentSecurityPolicy = `
    frame-src 'self';
    frame-ancestors 'none';
    object-src 'self';
    base-uri 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://plausible.io/js/plausible.js https://cdn.logrocket.io https://cdn.lr-ingest.io https://cdn.lr-in.com https://cdn.lr-in-prod.com; ;
    child-src 'self' blob:;
    style-src 'self' 'unsafe-inline';
    img-src * blob: data:;
    media-src 'self' *.cloudinary.com ;
    upgrade-insecure-requests;
    block-all-mixed-content;
    font-src 'self';
    form-action 'self';
    default-src 'self';
    connect-src 'self' https://*.logrocket.io https://*.lr-ingest.io https://*.logrocket.com https://*.lr-in.com https://*.lr-in-prod.com;
    worker-src 'self' blob:;
    `;

  const response = NextResponse.next();

  response.headers.set(
    "Content-Security-Policy",
    ContentSecurityPolicy.replace(/\n/g, "")
  );
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload"
  );
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-DNS-Prefetch-Control", "on");
  response.headers.set("X-XSS-Protection", "1; mode=block");

  return response;
}
