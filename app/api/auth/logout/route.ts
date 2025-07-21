import { NextResponse } from "next/server"

export async function POST() {
  const response = NextResponse.json({ message: "Logout realizado com sucesso" })

  // Clear authentication cookie
  response.cookies.set("auth_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  })

  return response
}
