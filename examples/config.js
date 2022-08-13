module.exports = {
  encrpyt_url: true,
  server: {
    host: 'https://localpc.cuan.dev',
    port: 3000
  },
  web: {
    name: 'MASTER RESEP',
    author: 'DUDE',
    target: 'https://portal-ilmu.com',
    histats_id: '4646696'
  },
  permalink: {
    base: ['web']
  },
  sitemap: {
    path: '/sitemap.xml',
    lists: [
      'https://hargadepo.com/sitemap_index.xml',
      'https://www.portal-ilmu.com/sitemap.xml'
    ]
  },
  webmaster: {
    google: '',
    bing: '',
    yandex: ''
  },
  encrypt_host_google: false
}
