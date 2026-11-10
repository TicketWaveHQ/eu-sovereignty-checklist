// Fixture: X-Frame-Options matches CSP frame-ancestors 'none'.
export default {
  async headers() {
    return [{ source: '/(.*)', headers: [{ key: 'X-Frame-Options', value: 'DENY' }] }]
  },
}
