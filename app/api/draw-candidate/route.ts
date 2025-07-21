import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/database"

export async function GET() {
  try {
    // Primeiro, tenta buscar candidatos aprovados
    let query = "SELECT * FROM applications WHERE status = 'aprovado' ORDER BY RAND() LIMIT 1"
    let result = (await executeQuery(query)) as any[]

    // Se não houver candidatos aprovados, busca entre todos os candidatos
    if (result.length === 0) {
      query = "SELECT * FROM applications ORDER BY RAND() LIMIT 1"
      result = (await executeQuery(query)) as any[]
    }

    if (result.length === 0) {
      return NextResponse.json(
        {
          error: "Nenhum candidato disponível para sorteio",
        },
        { status: 404 },
      )
    }

    const candidate = result[0]

    // Log do sorteio para auditoria
    console.log(`Candidato sorteado: ${candidate.nome_completo} (ID: ${candidate.id}) em ${new Date().toISOString()}`)

    return NextResponse.json({
      candidate,
      message: "Candidato sorteado com sucesso",
    })
  } catch (error) {
    console.error("Erro no sorteio de candidato:", error)
    return NextResponse.json(
      {
        error: "Erro interno do servidor",
      },
      { status: 500 },
    )
  }
}
