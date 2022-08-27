module.exports = {
  encrpyt_url: true,
  server: {
    host: 'https://localpc.cuan.dev',
    port: 3000
  },
  meta: {
    title: {
      append: 'depan ',
      prepend: 'belakang'
    }
  },
  web: {
    name: 'MASTER RESEP',
    author: 'DUDE',
    target: 'https://drakorindos.net',
    histats_id: '4646696'
  },
  permalink: {
    base: ['web']
  },
  sitemap: {
    path: '/sitemap.xml',
    lists: [
      'https://hargadepo.com/sitemap_index.xml',
      'https://www.portal-ilmu.com/sitemap.xml',
      'https://drakorindos.net/sitemap_index.xml',
      'https://dramaqu.digital/sitemap_index.xml',
      'https://www.tentangsinopsis.com/sitemap_index.xml'
    ]
  },
  webmaster: {
    google: '',
    bing: '',
    yandex: ''
  },
  encrypt_host_google: false
}
