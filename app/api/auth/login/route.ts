import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    console.log("Login attempt:", { username, password })

    if (!username || !password) {
      return NextResponse.json({ error: "Username e password são obrigatórios" }, { status: 400 })
    }

    // Simple authentication
    if (username === "admin" && password === "admin123") {
      const response = NextResponse.json({
        message: "Login realizado com sucesso",
        user: { id: 1, username: "admin" },
      })

      // Set authentication cookie
      response.cookies.set("auth_token", "authenticated-admin-session", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60, // 24 hours
        path: "/",
        sameSite: "lax",
      })

      console.log("Login successful")
      return response
    }

    console.log("Invalid credentials")
    return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
