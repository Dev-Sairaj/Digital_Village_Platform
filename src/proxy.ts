import { NextResponse } from "next/server";

// TODO: redirect unauthenticated users to /login
export function proxy() {
  return NextResponse.next();
}