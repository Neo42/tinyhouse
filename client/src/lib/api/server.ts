interface Body<Variables> {
  query: string
  variables?: Variables
}

interface Error {
  message: string
}

export const server = {
  fetch: async <Data = any, Variables = any>(body: Body<Variables>) => {
    const res = await fetch('/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      throw new Error('Failed to fetch from server.')
    }

    return res.json() as Promise<{
      data: Data
      errors: Error[]
    }>
  },
}
