// Fixture: data portability endpoint (UK GDPR Articles 15 and 20).
export async function GET() {
  return new Response('{}', { headers: { 'content-type': 'application/json' } })
}
