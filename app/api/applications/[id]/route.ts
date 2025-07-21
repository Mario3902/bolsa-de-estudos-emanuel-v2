import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const query = "SELECT * FROM applications WHERE id = ?"
    const result = (await executeQuery(query, [id])) as any[]

    if (result.length === 0) {
      return NextResponse.json({ error: "Candidatura não encontrada" }, { status: 404 })
    }

    // Get documents for this application
    const documentsQuery = "SELECT * FROM documents WHERE application_id = ?"
    const documents = await executeQuery(documentsQuery, [id])

    const application = {
      ...result[0],
      documents,
    }

    return NextResponse.json(application)
  } catch (error) {
    console.error("Error fetching application:", error)
    return NextResponse.json({ error: "Erro ao carregar candidatura" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const { status } = await request.json()

    const query = "UPDATE applications SET status = ?, updated_at = NOW() WHERE id = ?"
    await executeQuery(query, [status, id])

    return NextResponse.json({ message: "Status atualizado com sucesso" })
  } catch (error) {
    console.error("Error updating application:", error)
    return NextResponse.json({ error: "Erro ao atualizar status" }, { status: 500 })
  }
}
