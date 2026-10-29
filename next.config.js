module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    LAST_UPDATED: new Date().toLocaleDateString('en-CA', {
      timeZone: 'Asia/Shanghai'
    })
  },
  async headers() {
    return [
      {
        source: '/hollow_knight_fanart.v2.:extension(glb|webp)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      }
    ]
  }
  // for gh-pages deploy
  // output: 'export',
  // images: {
  //     unoptimized: true,
  // },
}
