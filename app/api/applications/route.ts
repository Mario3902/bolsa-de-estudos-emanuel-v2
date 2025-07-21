import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const status = searchParams.get("status")
    const categoria = searchParams.get("categoria")

    let query = "SELECT * FROM applications WHERE 1=1"
    const params: any[] = []

    if (search) {
      query += " AND (nome_completo LIKE ? OR email LIKE ? OR bilhete_identidade LIKE ?)"
      params.push(`%${search}%`, `%${search}%`, `%${search}%`)
    }

    if (status && status !== "todos") {
      query += " AND status = ?"
      params.push(status)
    }

    if (categoria && categoria !== "all") {
      query += " AND categoria = ?"
      params.push(categoria)
    }

    query += " ORDER BY created_at DESC"

    const applications = await executeQuery(query, params)
    return NextResponse.json({ applications })
  } catch (error) {
    console.error("Error fetching applications:", error)
    return NextResponse.json({ applications: [] })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const query = `
      INSERT INTO applications (
        nome_completo, email, telefone, bilhete_identidade, data_nascimento,
        endereco, situacao_academica, nome_escola, media_final, universidade,
        curso, categoria, carta_motivacao, nome_encarregado, telefone_encarregado
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `

    const params = [
      data.nome_completo,
      data.email,
      data.telefone,
      data.bilhete_identidade,
      data.data_nascimento,
      data.endereco,
      data.situacao_academica,
      data.nome_escola,
      data.media_final,
      data.universidade,
      data.curso,
      data.categoria,
      data.carta_motivacao,
      data.nome_encarregado,
      data.telefone_encarregado,
    ]

    const result = (await executeQuery(query, params)) as any

    return NextResponse.json({
      message: "Candidatura submetida com sucesso",
      applicationId: result.insertId,
    })
  } catch (error) {
    console.error("Error creating application:", error)
    return NextResponse.json({ error: "Erro ao submeter candidatura" }, { status: 500 })
  }
}
