import { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
    console.log("Method: ", request.method);
}

export const config = {
    matcher: ["/dashboard/:path*"]
}