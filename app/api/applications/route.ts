import { type NextRequest, NextResponse } from "next/server"
import { executeQuery, getApplicationStats } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const status = searchParams.get("status")
    const categoria = searchParams.get("categoria")
    const media_min = searchParams.get("media_min")
    const media_max = searchParams.get("media_max")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const offset = (page - 1) * limit

    const filters = {
      search,
      status,
      categoria,
      media_min,
      media_max,
      limit,
      offset
    }

    const applications = await executeQuery("SELECT", null, filters)
    const countResult = await executeQuery("COUNT", null, filters) as any[]
    const total = countResult[0]?.total || 0

    return NextResponse.json({
      applications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching applications:", error)
    return NextResponse.json({ applications: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0 } })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validar média mínima (agora é 16)
    if (data.media_final < 16) {
      return NextResponse.json(
        { error: "Média final deve ser pelo menos 16 valores" },
        { status: 400 }
      )
    }

    const applicationData = {
      nome_completo: data.nomeCompleto || data.nome_completo,
      email: data.email,
      telefone: data.telefone,
      bilhete_identidade: data.bilheteIdentidade || data.bilhete_identidade,
      data_nascimento: data.dataNascimento || data.data_nascimento,
      endereco: data.endereco,
      situacao_academica: data.situacaoAcademica || data.situacao_academica,
      nome_escola: data.nomeEscola || data.nome_escola,
      media_final: parseFloat(data.mediaFinal || data.media_final),
      universidade: data.universidade,
      curso: data.curso,
      categoria: data.categoria,
      carta_motivacao: data.cartaMotivacao || data.carta_motivacao,
      nome_encarregado: data.nomeEncarregado || data.nome_encarregado,
      telefone_encarregado: data.telefoneEncarregado || data.telefone_encarregado,
      status: 'pendente'
    }

    const result = await executeQuery("INSERT", applicationData)

    return NextResponse.json({
      message: "Candidatura submetida com sucesso",
      applicationId: result.insertId,
    })
  } catch (error: any) {
    console.error("Error creating application:", error)
    
    // Verificar se é erro de duplicação (email ou BI já existente)
    if (error.code === 11000) {
      const field = error.keyPattern?.email ? 'email' : 'bilhete de identidade'
      return NextResponse.json(
        { error: `Este ${field} já está registado no sistema` },
        { status: 400 }
      )
    }
    
    return NextResponse.json({ error: "Erro ao submeter candidatura" }, { status: 500 })
  }
}
