import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const paths = Array.isArray(body?.paths) ? body.paths : []

    paths.forEach((path) => {
      if (typeof path === 'string' && path.startsWith('/')) {
        revalidatePath(path)
      }
    })

    return NextResponse.json({ revalidated: true })
  } catch {
    return NextResponse.json({ revalidated: false }, { status: 500 })
  }
}
