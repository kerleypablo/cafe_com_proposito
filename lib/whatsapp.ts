export function normalizeWhatsappPhone(phone: string | null | undefined) {
  if (!phone) return ''
  return phone.replace(/\D/g, '')
}

export function buildWhatsappLink(phone: string | null | undefined) {
  const normalizedPhone = normalizeWhatsappPhone(phone)
  if (!normalizedPhone) return null
  return `https://wa.me/${normalizedPhone}`
}
