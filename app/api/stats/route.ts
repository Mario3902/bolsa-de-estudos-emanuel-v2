import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/database"

export async function GET() {
  try {
    const totalQuery = "SELECT COUNT(*) as total FROM applications"
    const pendingQuery = "SELECT COUNT(*) as pending FROM applications WHERE status = 'pendente'"
    const approvedQuery = "SELECT COUNT(*) as approved FROM applications WHERE status = 'aprovado'"
    const rejectedQuery = "SELECT COUNT(*) as rejected FROM applications WHERE status = 'rejeitado'"
    const analysisQuery = "SELECT COUNT(*) as analysis FROM applications WHERE status = 'em-analise'"

    const [totalResult] = (await executeQuery(totalQuery)) as any[]
    const [pendingResult] = (await executeQuery(pendingQuery)) as any[]
    const [approvedResult] = (await executeQuery(approvedQuery)) as any[]
    const [rejectedResult] = (await executeQuery(rejectedQuery)) as any[]
    const [analysisResult] = (await executeQuery(analysisQuery)) as any[]

    const stats = {
      total: totalResult.total || 0,
      pending: pendingResult.pending || 0,
      approved: approvedResult.approved || 0,
      rejected: rejectedResult.rejected || 0,
      analysis: analysisResult.analysis || 0,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json({
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      analysis: 0,
    })
  }
}
