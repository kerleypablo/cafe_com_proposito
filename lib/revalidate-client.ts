export async function revalidatePaths(paths: string[]) {
  try {
    await fetch('/api/revalidate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ paths }),
    })
  } catch {
    // Best-effort cache refresh.
  }
}
