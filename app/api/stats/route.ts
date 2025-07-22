import { type NextRequest, NextResponse } from "next/server"
import { getApplicationStats, executeQuery } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") || "geral"

    switch (type) {
      case "geral":
        const stats = await getApplicationStats()
        return NextResponse.json(stats)

      case "relevancia":
        // Estatísticas por faixas de relevância
        const relevanciaStats = await executeQuery("AGGREGATE", [
          {
            $bucket: {
              groupBy: "$relevancia_score",
              boundaries: [0, 25, 50, 75, 100, 101],
              default: "Outros",
              output: {
                count: { $sum: 1 },
                media_score: { $avg: "$relevancia_score" },
                media_final_avg: { $avg: "$media_final" }
              }
            }
          }
        ])
        return NextResponse.json({ relevancia: relevanciaStats })

      case "categoria_media":
        // Estatísticas detalhadas por categoria e média
        const categoriaMediaStats = await executeQuery("AGGREGATE", [
          {
            $group: {
              _id: {
                categoria: "$categoria",
                faixa_media: {
                  $switch: {
                    branches: [
                      { case: { $lt: ["$media_final", 17] }, then: "16.0-16.9" },
                      { case: { $lt: ["$media_final", 18] }, then: "17.0-17.9" },
                      { case: { $lt: ["$media_final", 19] }, then: "18.0-18.9" },
                      { case: { $lt: ["$media_final", 20] }, then: "19.0-19.9" },
                    ],
                    default: "20.0+"
                  }
                }
              },
              count: { $sum: 1 },
              media_avg: { $avg: "$media_final" },
              relevancia_avg: { $avg: "$relevancia_score" }
            }
          },
          { $sort: { "_id.categoria": 1, "_id.faixa_media": 1 } }
        ])
        return NextResponse.json({ categoria_media: categoriaMediaStats })

      case "timeline":
        // Estatísticas por período (últimos 30 dias)
        const timelineStats = await executeQuery("AGGREGATE", [
          {
            $match: {
              created_at: {
                $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Últimos 30 dias
              }
            }
          },
          {
            $group: {
              _id: {
                $dateToString: {
                  format: "%Y-%m-%d",
                  date: "$created_at"
                }
              },
              count: { $sum: 1 },
              media_avg: { $avg: "$media_final" },
              relevancia_avg: { $avg: "$relevancia_score" }
            }
          },
          { $sort: { "_id": 1 } }
        ])
        return NextResponse.json({ timeline: timelineStats })

      case "top_candidatos":
        // Top 10 candidatos por relevância
        const topCandidatos = await executeQuery("SELECT", null, {
          limit: 10,
          offset: 0
        })
        return NextResponse.json({ top_candidatos: topCandidatos })

      default:
        return NextResponse.json({ error: "Tipo de estatística não suportado" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json({ error: "Erro ao obter estatísticas" }, { status: 500 })
  }
}

