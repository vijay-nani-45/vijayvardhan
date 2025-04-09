import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET() {
  try {
    const resumePath = path.join(process.cwd(), "public", "resume.json")
    const resumeData = JSON.parse(fs.readFileSync(resumePath, "utf8"))
    return NextResponse.json(resumeData)
  } catch (error) {
    console.error("Error reading resume file:", error)
    return NextResponse.json({ error: "Failed to fetch resume data" }, { status: 500 })
  }
}
