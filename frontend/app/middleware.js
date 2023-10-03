import { NextResponse } from "next/server";

export default function middleware(request) {
  if (request.nextUrl.pathname == "/dashboard") {
    return NextResponse.rewrite(new URL("/dashboard/home", request.url));
  }

  if (request.cookies.has("permissions")) {
    let permissionCookie = request.cookies.get("permissions");
    var permission = JSON.parse(permissionCookie.value);
    if (!permission.admin) {
      if (request.nextUrl.pathname.startsWith("/dashboard")) {
        let url = request.nextUrl.pathname.replace("/dashboard/", "");

        if (url.includes("components")) {
          if (!permission["components"])
            return NextResponse.redirect(request.nextUrl.origin);
        } else {
          if (!permission[url] && url != "home") {
            return NextResponse.redirect(request.nextUrl.origin);
          }
        }
      }
    }
  }
}
