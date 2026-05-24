export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/patient/:path*",
    "/doctor/:path*",
    "/api/patients/:path*",
    "/api/alerts/:path*",
  ],
};