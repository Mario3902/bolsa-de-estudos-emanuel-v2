import { type NextRequest, NextResponse } from "next/server"
import { readFile } from "fs/promises"
import path from "path"

export async function GET(request: NextRequest, { params }: { params: { filename: string } }) {
  try {
    const filename = params.filename
    const uploadDir = process.env.UPLOAD_DIR || "./uploads"
    const filePath = path.join(process.cwd(), uploadDir, filename)

    const file = await readFile(filePath)
    const extension = path.extname(filename).toLowerCase()

    let contentType = "application/octet-stream"
    if (extension === ".pdf") contentType = "application/pdf"
    else if ([".jpg", ".jpeg"].includes(extension)) contentType = "image/jpeg"
    else if (extension === ".png") contentType = "image/png"

    return new NextResponse(file, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `inline; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error("Error serving file:", error)
    return NextResponse.json({ error: "Arquivo não encontrado" }, { status: 404 })
  }
}
