"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    console.log("Attempting login with:", { username, password })

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      console.log("Login response status:", response.status)
      const data = await response.json()
      console.log("Login response data:", data)

      if (response.ok) {
        console.log("Login successful, redirecting...")
        window.location.href = "/admin"
      } else {
        setError(data.error || "Credenciais inválidas")
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("Erro ao tentar fazer login. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-800 via-emerald-900 to-slate-800">
      <Card className="w-full max-w-md bg-white/10 border-white/20 backdrop-blur-sm text-white">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Login Administrativo</CardTitle>
          <p className="text-gray-300">Acesse o painel de gestão da Bolsa de estudos</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <Label htmlFor="username" className="text-white">
                Usuário
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="Digite seu usuário"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-white">
                Senha
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
            </div>
            {error && <div className="text-red-400 text-sm text-center">{error}</div>}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
              disabled={loading}
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          {/* Debug info - remove in production */}
          <div className="mt-4 p-3 bg-black/20 rounded text-xs text-gray-400">
            <p>
              <strong>Credenciais para teste:</strong>
            </p>
            <p>Username: *******</p>
            <p>Password: *******</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
