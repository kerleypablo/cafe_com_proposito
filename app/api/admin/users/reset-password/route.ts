import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Nao autorizado.' }, { status: 401 })
    }

    const body = await request.json().catch(() => ({}))
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''
    const password = typeof body?.password === 'string' ? body.password : ''

    if (!email) {
      return NextResponse.json({ error: 'Informe o email do usuario.' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'A senha precisa ter pelo menos 6 caracteres.' },
        { status: 400 },
      )
    }

    const adminSupabase = createAdminClient()
    const { data: usersData, error: listError } = await adminSupabase.auth.admin.listUsers({
      page: 1,
      perPage: 200,
    })

    if (listError) {
      return NextResponse.json(
        { error: listError.message || 'Nao foi possivel listar os usuarios.' },
        { status: 500 },
      )
    }

    const targetUser = usersData.users.find((listedUser) => listedUser.email?.toLowerCase() === email)

    if (!targetUser) {
      return NextResponse.json({ error: 'Usuario nao encontrado para esse email.' }, { status: 404 })
    }

    const { error: updateError } = await adminSupabase.auth.admin.updateUserById(targetUser.id, {
      password,
    })

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message || 'Nao foi possivel atualizar a senha.' },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      email: targetUser.email,
    })
  } catch {
    return NextResponse.json({ error: 'Erro interno ao atualizar a senha.' }, { status: 500 })
  }
}
