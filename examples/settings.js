/* eslint-disable no-template-curly-in-string */
const config = require('./config')
const siteSettings = require('./site-settings')
const googleSiteVerification = config.webmaster.google || ''
const sitemapPermalink = config.sitemap.path || '/sitemap.xml'
const webName = config.web.name || 'nama situs'
const webNameAlt = config.web.name || 'nama situs'
const author = config.web.author || 'Admin'
const sitemapList = config.sitemap.lists || []
const target = config.web.target || 'https://ndower.dev'
const mapPermalink = config.permalink.base || ['master']

const settings = {
  webName,
  webNameAlt,
  author,
  remove_comment_html: true,
  remove_encrypted_scripts: true,
  minify_options: {
    removeComments: false,
    removeCommentsFromCDATA: false,
    collapseWhitespace: false,
    collapseBooleanAttributes: false,
    removeAttributeQuotes: false,
    removeRedundantAttributes: false,
    useShortDoctype: false,
    removeEmptyAttributes: false,
    removeOptionalTags: false,
    removeEmptyElements: false
  },
  sitemapPermalink,
  sitemapList,
  target,
  mapPermalink,
  name_folder_sitemap: 'sitemap',
  element_remove: [
    '#___gcse_0',
    '.adsbygoogle',

    'noscript',
    '#fixedban',
    'div[id*="ScriptRoot"]',
    'a[href*="rebrand.ly"]',
    '.statcounter',
    'a[href*="statcounter.com"]',
    'meta[property^="og:"]',
    'script[type="text/javascript"]',
    'meta[name="clckd"]',
    'meta[name="google-site-verification"]',
    'meta[name="google-adsense-platform-domain"]',
    'meta[name="google-adsense-platform-account"]',
    'script[src^="https://cse.google.com/"]',
    'script[src*="mgid.com"]',
    'script[src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]',
    'script[src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]',
    'script[src="https://www.google-analytics.com/analytics.js"]'
  ],

  replaceString: [

  ],
  costom_element_remove: siteSettings,
  inject_element_head: [
    // {
    //   name_element: 'script',
    //   data_attribute: [
    //     {
    //       name_attribute: 'src',
    //       value_attribute: '/head.js'
    //     }
    //   ],
    //   data_innerHTML: '',
    //   position: 'start'
    // },

    {
      name_element: 'meta',
      data_attribute: [
        {
          name_attribute: 'name',
          value_attribute: 'viewport'
        },
        {
          name_attribute: 'content',
          value_attribute:
            'width=device_width, initial_scale=1.0, user_scalable=1.0, minimum_scale=1.0, maximum_scale=5.0'
        }
      ],
      data_innerHTML: '',
      position: 'start'
    },
    {
      name_element: 'meta',
      data_attribute: [
        {
          name_attribute: 'name',
          value_attribute: 'google_site_verification'
        },
        {
          name_attribute: 'content',
          value_attribute: `${googleSiteVerification}`
        }
      ],
      data_innerHTML: '',
      position: 'start'
    },
    {
      name_element: 'meta',
      data_attribute: [
        {
          name_attribute: 'name',
          value_attribute: 'description'
        },
        {
          name_attribute: 'content',
          // eslint-disable-next-line no-template-curly-in-string
          value_attribute: '${descriptionPost}'
        }
      ],
      data_innerHTML: '',
      position: 'start'
    },
    {
      name_element: 'meta',
      data_attribute: [
        {
          name_attribute: 'charset',
          value_attribute: 'UTF_8'
        }
      ],
      data_innerHTML: '',
      position: 'start'
    },
    {
      name_element: 'meta',
      data_attribute: [
        {
          name_attribute: 'property',
          value_attribute: 'og:type'
        },
        {
          name_attribute: 'content',
          value_attribute: 'article'
        }
      ],
      data_innerHTML: '',
      position: 'start'
    },
    {
      name_element: 'meta',
      data_attribute: [
        {
          name_attribute: 'property',
          value_attribute: 'og:title'
        },
        {
          name_attribute: 'content',
          value_attribute: '${titlePost}'
        }
      ],
      data_innerHTML: '',
      position: 'start'
    },
    {
      name_element: 'meta',
      data_attribute: [
        {
          name_attribute: 'property',
          value_attribute: 'og:description'
        },
        {
          name_attribute: 'content',
          value_attribute: '${descriptionPost}'
        }
      ],
      data_innerHTML: '',
      position: 'start'
    },
    {
      name_element: 'meta',
      data_attribute: [
        {
          name_attribute: 'property',
          value_attribute: 'og:url'
        },
        {
          name_attribute: 'content',
          value_attribute: '${urlPost}'
        }
      ],
      data_innerHTML: '',
      position: 'start'
    },
    {
      name_element: 'meta',
      data_attribute: [
        {
          name_attribute: 'property',
          value_attribute: 'og:site_name'
        },
        {
          name_attribute: 'content',
          value_attribute: '${nameWeb}'
        }
      ],
      data_innerHTML: '',
      position: 'start'
    },
    {
      name_element: 'meta',
      data_attribute: [
        {
          name_attribute: 'property',
          value_attribute: 'article:published_time'
        },
        {
          name_attribute: 'content',
          value_attribute: '${timePublish}'
        }
      ],
      data_innerHTML: '',
      position: 'start'
    },

    {
      name_element: 'beforehead',
      data_attribute: [],
      data_innerHTML: '',
      position: 'end'
    },
    {
      name_element: 'meta',
      data_attribute: [
        {
          name_attribute: 'property',
          value_attribute: 'article:author'
        },
        {
          name_attribute: 'content',
          value_attribute: '${authorPost}'
        }
      ],
      data_innerHTML: '',
      position: 'start'
    }
  ],
  inject_element_body: [
    {
      name_element: 'center',
      data_attribute: [],
      data_innerHTML: '<big></big>',
      position: 'start'
    },
    {
      name_element: 'afterbody',
      data_attribute: [],
      data_innerHTML: '',
      position: 'start'
    }
    // {
    //   name_element: 'script',
    //   data_attribute: [
    //     {
    //       name_attribute: 'src',
    //       value_attribute: '/assets/inject.js'
    //     }
    //   ],
    //   data_innerHTML: '',
    //   position: 'end'
    // }
  ]
}

module.exports = settings
