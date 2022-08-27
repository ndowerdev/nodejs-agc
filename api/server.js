const fs = require('fs')
const fx28 = require('fx28-node')
const unirest = require('unirest')
// const random_useragent = require('random-useragent')
const isUrl = require('is-valid-http-url')
// const beautify = require('json-beautify')
const jsdom = require('jsdom')
const parseUrl = require('url-parse')
const removeHtmlComments = require('remove-html-comments')
const mime = require('mime-types')
// const minify = require('html-minifier').minify
// const { gzip, ungzip } = require('node-gzip')
const { gzip } = require('node-gzip')
const settings = require('../settings')
const { host } = require('../settings')
const config = require('../config')

// const useragent = require('express-useragent')

const { JSDOM } = jsdom
const virtualConsole = new jsdom.VirtualConsole()
const headerDafult = {
  'User-Agent': 'Not A;Brand";v="99", "Chromium";v="90", "Google Chrome";v="90',
  referer: 'https://www.google.com'
}

const getFile = async (path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(process.cwd() + '/' + path, 'utf-8', (err, data) => {
      if (err) {
        resolve('err')
      } else {
        resolve(data)
      }
    })
  })
}

const getListFile = async (path) => {
  return new Promise((resolve, reject) => {
    fs.readdir(process.cwd() + '/' + path, (err, files) => {
      if (err) {
        resolve([])
      } else {
        const dataBack = []
        files.forEach((file) => {
          dataBack.push(path + '/' + file)
        })
        resolve(dataBack)
      }
    })
  })
}

const curlLink = async (url) => {
  return new Promise((resolve, reject) => {
    const testCurl = unirest
      .request({
        uri: url,
        headers: headerDafult
      })
      .on('error', (error) => {
        console.log(error)
        resolve('err')
      })
    testCurl.on('response', (response) => {
      try {
        testCurl.destroy()
        const backSend = {}
        backSend.headers = response.headers
        backSend.code = response.statusCode
        resolve(backSend)
      } catch (e) {
        resolve('err')
      }
    })
  })
}

const curlContent = async (url) => {
  return new Promise((resolve, reject) => {
    let dataBody = ''
    unirest.request({
      uri: url,
      headers: headerDafult,
      gzip: true
    }).on('error', (error) => {
      console.log(error)
      resolve('err')
    }).on('data', (data) => {
      dataBody += data
    }).on('end', () => {
      resolve(dataBody)
    })
  })
}

const removeElement = async (data, dom) => {
  return new Promise((resolve, reject) => {
    data.forEach((a) => {
      dom.querySelectorAll(a).forEach((b) => {
        b.remove()
      })
    })
    resolve()
  })
}

const remakeUrlElement = async (dom, option) => {
  return new Promise((resolve, reject) => {
    const hostnameComing = option.hostname

    dom.querySelectorAll(option.element).forEach((a) => {
      let hrefAttr = a.getAttribute(option.target)
      if (hrefAttr == null) {
        // console.log(option)
      } else {
        if (hrefAttr.indexOf('//') === 0) {
          hrefAttr = hrefAttr.replace('//', option.proto + '://')
        } else {
          // tandanya

          // console.log(hrefAttrx)
          if (isUrl(hrefAttr) === false) {
            if (hrefAttr.indexOf('#') === 0) {
              hrefAttr = '#'
            } else if (hrefAttr.indexOf('javascript') === 0) {
              hrefAttr = '#'
            } else if (hrefAttr.indexOf('/') === 0) {
              hrefAttr = option.url + hrefAttr
            } else {
              hrefAttr = option.url + '/' + hrefAttr
            }

            // console.log(hrefAttr)
            // if (process.env.ENCRYPT_HOST === 'true') {
            //   hrefAttr = Buffer.from(hrefAttr, 'base64url').toString()
            //   console.log(hrefAttr)
            // }
          }
        }
        // dont remake base64 image
        if (!a.getAttribute(option.target).includes('base64')) {
          // console.log(option)
          let hostnameHref = parseUrl(hrefAttr).hostname
          if (hostnameHref === hostnameComing) {
            const mapHref = parseUrl(hrefAttr)

            const pathHref = mapHref.pathname + mapHref.query
            const dataReplace = option.origin + pathHref
            a.setAttribute(option.remake, dataReplace)
          } else {
            if (isUrl(hrefAttr) === false) {
              a.setAttribute(option.remake, hrefAttr)
            } else {
              const mapHref = parseUrl(hrefAttr)
              // eslint-disable-next-line no-unused-vars
              const protoHref = mapHref.protocol.replace(':', '-')
              const pathHref = mapHref.pathname + mapHref.query

              // const dataReplace = option.origin + '/' + option.permalink + '-' + protoHref + hostnameHref + pathHref
              // console.log(option.permalink)
              if (config.encrpyt_url) {
                // hostnameHref = Buffer.from(option.permalink + '-' + protoHref + hostnameHref, 'utf8').toString('base64')
                hostnameHref = fx28.encode(Buffer.from(option.permalink + '-' + protoHref + hostnameHref, 'utf8'))
              } else {
                hostnameHref = option.permalink + '-' + protoHref + hostnameHref
              }
              const dataReplace = option.origin + '/' + hostnameHref + pathHref

              const dontRemakeList = [
                'blogger.googleusercontent.com',
                'bp.blogspot.com'
              ]

              if (dontRemakeList.includes(hostnameHref) === false && config.encrypt_host_google === 'true') {
                a.setAttribute(option.remake, dataReplace)
              } else {
                a.setAttribute(option.remake, dataReplace)
              }
            }
          }
        }
      }
    })
    resolve()
  })
}

const cekPermalink = async (val, data) => {
  return new Promise((resolve, reject) => {
    try {
      if (typeof val === 'string' && typeof data === 'object') {
        let dataMap = null
        for (const map of data) {
          if (val.indexOf('/' + map + '-') >= 0) {
            dataMap = map
          }
        }
        resolve(dataMap)
      } else {
        resolve(null)
      }
    } catch (e) {
      resolve(null)
    }
  })
}

const randomPermalink = async (obj) => {
  return new Promise((resolve, reject) => {
    try {
      if (typeof obj === 'object') {
        const dataMap = obj[parseInt(Math.random() * obj.length)]
        resolve(dataMap)
      } else {
        resolve('host')
      }
    } catch (e) {
      resolve('host')
    }
  })
}

module.exports = async (req, res, isbot = false) => {
  // --- handle send response vercel (01) --
  if (!res.status) {
    res.status = (input) => {
      res.writeHead(input)
    }
  }
  if (!res.send) {
    res.send = (input) => {
      res.end(input)
    }
  }
  // ----- end (01) --------
  // let dataSetting = await getFile("setting.json");
  // dataSetting = await JSON.parse(dataSetting);
  const dataSetting = require('../settings')
  // console.log(dataSetting.map_permalink)
  const mapPermalink = await dataSetting.mapPermalink
  const targetSitemap = await getListFile('sitemap')

  // const appEnv = process.env.APP_ENV || 'local'

  let proto = req.headers['x-forwarded-proto']
  if (!proto) {
    proto = 'https'
  }
  // if (proto) {
  //   proto = proto
  // } else {
  //   proto = 'https'
  // }

  const originUrl = 'https://' + req.headers.host

  // let originUrl = (await proto) + "://" + req.headers.host;
  // let fullUrl = (await originUrl) + req.url;
  // req.url = Buffer.from(req.url.replace('/', ''), 'base64').toString('utf-8')

  if (config.encrpyt_url && !req.url.startsWith('/assets') && !req.url.startsWith('/sitemap.xml') && !req.url.startsWith('/robots') && !req.url.startsWith('/head.js')) {
    const split = req.url.split('/')

    const encodedString = split[1].trim()
    // const decodedString = Buffer.from(encodedString, 'base64').toString('utf-8')
    const decodedString = fx28.decode(encodedString).toString()

    req.url = req.url.replace(encodedString, decodedString)
  }

  const fullUrl = originUrl + req.url

  let typePermalink = await cekPermalink(req.url, mapPermalink)
  // console.log(typePermalink)
  try {
    // check if robots.txt
    if (req.url === '/robots.txt') {
      res.status(200)
      const sitemapList = settings.sitemapList
      const sitemapPermalink = await randomPermalink(mapPermalink)
      console.log(sitemapPermalink)
      res.write(
        'User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /ajax/\nDisallow: /json/\nDisallow: /member/\nDisallow: /auth/\n\n\n'
      )
      sitemapList.forEach((a) => {
        res.write(`${config.server.host}/${sitemapPermalink}-https-${a}\n`)
      })

      res.send()
    } else if (req.url === dataSetting.sitemapPermalink) {
      res.setHeader('Content-Type', 'application/xml')
      res.status(200)
      res.write('<?xml version="1.0" encoding="UTF-8"?><?xml-stylesheet type="text/xsl" href="' + originUrl.replace('http://', 'https://') + '/assets/main-sitemap.xsl"?>\n')
      res.write('<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n')

      const sitemapPermalink = await randomPermalink(mapPermalink)
      // settings.sitemap_list.forEach(function (a) {
      config.sitemap.lists.forEach(function (a) {
        let encodedUrlParam = `${sitemapPermalink}-${a.replace('://', '-')}`
        if (config.encrpyt_url) {
          const parsing = parseUrl(a)
          const urlParam = `web-${parsing.protocol.replace(':', '-')}${parsing.hostname}`
          encodedUrlParam = fx28.encode(Buffer.from(urlParam), 'utf8') + `${parsing.pathname}`
          console.log(encodedUrlParam)
        }

        res.write(' <sitemap>\n')

        res.write(
          // `   <loc>${config.server.host}/sitemap-https-` + a + '</loc>\n'
          `   <loc>${config.server.host}/${encodedUrlParam}</loc>\n`
        )
        // res.write(`   <lastmod>` + new Date().toISOString() + `</lastmod>\n`);
        res.write(' </sitemap>\n')
      })
      res.write('</sitemapindex>\n')

      res.write('<!-- XML Sitemap generated by NodeJs -->')
      res.send()
    } else if (req.url === '/pingsitemap') {
      res.status(200)
      const sitemapUrl = `https://www.google.com/webmasters/tools/ping?sitemap=${config.server.host}/${config.sitemap.path}`
      const pingCommand = await curlContent(sitemapUrl)
      res.write(pingCommand)
      res.send('ok')
    } else if (
      req.url.indexOf(dataSetting.name_folder_sitemap) > 0 &&
      req.url.indexOf('.xml') > 0 &&
      typePermalink == null &&
      req.method === 'GET'
    ) {
      let statusSitemap = false
      let linkSubSitemap = ''

      config.sitemap.lists.forEach(function (a) {
        if (req.url.indexOf(a) === 1) {
          statusSitemap = true
          linkSubSitemap = a
        }
      })

      if (statusSitemap) {
        const getLinkSubSitemap = await getFile(linkSubSitemap)
        const data = getLinkSubSitemap
        if (data === 'err') {
          res.end('404a')
        } else {
          const listUrlSitemap = data.split('\n')
          if (listUrlSitemap.length === 0) {
            res.end('404b')
          } else {
            res.write(
              '<?xml version="1.0" encoding="UTF-8"?><?xml-stylesheet type="text/xsl" href="' +
                originUrl.replace('http://', 'https://') +
                `/assets/main-sitemap.xsl"?>
<urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd http://www.google.com/schemas/sitemap-image/1.1 http://www.google.com/schemas/sitemap-image/1.1/sitemap-image.xsd" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`
            )
            listUrlSitemap.forEach(function (a) {
              res.write(' <url>\n')
              res.write('   <loc>' + a + '</loc>\n')
              res.write(
                '   <lastmod>' + new Date().toISOString() + '</lastmod>\n'
              )
              res.write(' </url>\n')
            })
            res.write(`</urlset>
<!-- XML Sitemap generated by NodeJs -->`)
            res.send()
          }
        }
      } else {
        res.writeHead(200, {
          'content-type': 'text/xml; charset=UTF-8'
        })
        res.write(
          '<?xml version="1.0" encoding="UTF-8"?><?xml-stylesheet type="text/xsl" href="' +
            originUrl.replace('http://', 'https://') +
            '/assets/main-sitemap.xsl"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        )
        targetSitemap.forEach(function (a) {
          res.write(' <sitemap>\n')
          res.write(
            '   <loc>' +
              originUrl.replace('http://', 'https://') +
              '/' +
              a +
              '</loc>\n'
          )
          res.write('   <lastmod>' + new Date().toISOString() + '</lastmod>\n')
          res.write(' </sitemap>\n')
        })
        res.write('</sitemapindex>\n<!-- XML Sitemap generated by NodeJs -->')
        res.end()
      }
    // eslint-disable-next-line brace-style
    } else if ((req.url.split('/assets/')[1] === undefined) === false && req.method === 'GET' && typePermalink == null) {
      // ------- file assets -----------
      const dataFile = req.url.split('/assets/')[1]
      if (dataFile.length > 0) {
        const files = await getListFile('assets')
        let fixFile = ''
        for (const aa of files) {
          if (aa === 'assets/' + dataFile) {
            fixFile = aa
          }
        }
        if (fixFile.length > 0) {
          const typeMime = mime.lookup(fixFile)
          if (typeMime) {
            const data = await getFile(fixFile)
            res.writeHead(200, {
              'content-type': typeMime
            })
            res.end(data)
          } else {
            res.end('404c')
          }
        } else {
          res.end('404d')
        }
      } else {
        res.end('404e')
      }
    } else if ((req.url.length > 1 && req.method === 'GET') || req.url === '/') {
      // ----------- page --------

      try {
        const urlPost = (await parseUrl(req.url).pathname.replace('/', '')) + parseUrl(req.url).query

        // if (config.encrpyt_url) {
        //   const split = urlPost.split('/')

        //   const encodedString = split[0]

        //   // const decodedString = Buffer.from(encodedString, 'base64').toString('utf-8')
        //   const decodedString = fx28.decode(encodedString).toString()

        //   urlPost = urlPost.replace(encodedString, decodedString).trim()
        // }

        // eslint-disable-next-line no-unused-vars
        const typeMime = await mime.lookup(urlPost)

        let linkPost = (await dataSetting.target) + '/' + urlPost

        let statusOrigin = true
        let dataOrigin = ''
        if (urlPost.indexOf(typePermalink + '-') === 0) {
          const dataLink = await urlPost.split(typePermalink + '-')[1]
          linkPost = await dataLink
            .replace('https-', 'https://')
            .replace('http-', 'http://')
          statusOrigin = false

          const parsingLinkPost = parseUrl(linkPost)

          dataOrigin = (await typePermalink) + '-' + parseUrl(linkPost).origin.replace('https://', 'https-').replace('http://', 'http-')
          if (config.encrpyt_url) {
            const urlParam = `web-${parsingLinkPost.protocol.replace(':', '-')}${parsingLinkPost.hostname}`
            dataOrigin = fx28.encode(Buffer.from(urlParam), 'utf8')
            // const urlParam = `web-${parsingLinkPost.protocol.replace(':', '-')}${parsingLinkPost.hostname}`
            // dataOrigin = fx28.encode(Buffer.from(urlParam), 'utf8') + `${parsingLinkPost.pathname}`
          }
        }
        if (isUrl(linkPost)) {
          const getInfo = await curlLink(linkPost)

          if (getInfo === 'err') {
            res.end('404e')
          } else {
            const typeContent = getInfo.headers['content-type']
            const codeContent = getInfo.code
            const resOriginHeader = {}
            if (getInfo.headers['cache-control']) {
              resOriginHeader['cache-control'] = getInfo.headers['cache-control']
            }
            if (getInfo.headers.etag) {
              resOriginHeader.etag = getInfo.headers.etag
            }
            if (getInfo.headers['content-type']) {
              resOriginHeader['content-type'] = getInfo.headers['content-type']
            }
            if (getInfo.headers['last-modified']) {
              resOriginHeader['last-modified'] =
                getInfo.headers['last-modified']
            }
            // filter content type
            // ---------- page html ----------
            if (typeContent.indexOf('text/html') === 0 && codeContent !== 404) {
              const hostname = parseUrl(linkPost).hostname
              const origin = parseUrl(linkPost).origin
              const dataContent = await curlContent(linkPost)
              const body = dataContent
              /**
               * replace string module
               * by : ndowerdev
               */

              if (body === 'err') {
                res.end('404f')
              } else {
                res.writeHead(200, {
                  'content-type': typeContent,
                  'content-encoding': 'gzip'
                })
                if (typePermalink == null) {
                  typePermalink = await randomPermalink(mapPermalink)
                }
                let dom = new JSDOM(body, { virtualConsole }).window.document
                await removeElement(dataSetting.element_remove, dom)
                await remakeUrlElement(dom, {
                  element: 'link',
                  target: 'href',
                  remake: 'href',
                  origin: originUrl,
                  proto,
                  url: origin,
                  hostname: parseUrl(dataSetting.target).hostname,
                  permalink: typePermalink
                })
                await remakeUrlElement(dom, {
                  element: 'a',
                  target: 'href',
                  remake: 'href',
                  origin: originUrl,
                  proto,
                  url: origin,
                  hostname: parseUrl(dataSetting.target).hostname,
                  permalink: typePermalink
                })
                await remakeUrlElement(dom, {
                  element: 'img',
                  target: 'src',
                  remake: 'src',
                  origin: originUrl,
                  proto,
                  url: origin,
                  hostname: parseUrl(dataSetting.target).hostname,
                  permalink: typePermalink
                })
                await remakeUrlElement(dom, {
                  element: 'img',
                  target: 'data-src',
                  remake: 'src',
                  origin: originUrl,
                  proto,
                  url: origin,
                  hostname: parseUrl(dataSetting.target).hostname,
                  permalink: typePermalink
                })

                dataSetting.inject_element_head.reverse().forEach(function (a) {
                  const createEl = dom.createElement(a.name_element)
                  a.data_attribute.forEach(function (b) {
                    createEl.setAttribute(b.name_attribute, b.value_attribute)
                  })
                  createEl.innerHTML = a.data_innerHTML
                  if (a.position === 'start') {
                    dom.head.insertBefore(createEl, dom.head.firstChild)
                    // dom.head.appendChild(dom.createTextNode("\n"));
                  } else {
                    dom.head.appendChild(createEl)
                    // dom.head.appendChild(dom.createTextNode("\n"));
                  }
                })

                dataSetting.inject_element_body.reverse().forEach(function (a) {
                  const createEl = dom.createElement(a.name_element)
                  a.data_attribute.forEach(function (b) {
                    createEl.setAttribute(b.name_attribute, b.value_attribute)
                  })
                  createEl.innerHTML = a.data_innerHTML
                  if (a.position === 'start') {
                    dom.body.insertBefore(createEl, dom.body.firstChild)
                  } else {
                    dom.body.appendChild(createEl)
                  }
                })

                // insert histats inline
                const histatsid = config.web.histats_id || null
                if (histatsid != null) {
                  const histats = dom.createElement('script')
                  histats.type = 'text/javascript'
                  histats.innerHTML =
                    `if(!Histats_variables){var Histats_variables=[];}
                    Histats_variables.push("tags","` + host + `");
                    var _Hasync = _Hasync || [];
                  _Hasync.push(['Histats.start', '1,` +
                    histatsid +
                    `,4,0,0,0,00010000']);
                  _Hasync.push(['Histats.fasi', '1']);
                  _Hasync.push(['Histats.track_hits', '']);
                  (function () {
                    var hs = document.createElement('script');
                    hs.type = 'text/javascript';
                    hs.async = true;
                    hs.src = ('//s10.histats.com/js15_as.js');
                    (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(hs);
                  })();`
                  dom.body.insertBefore(histats, dom.body.lastChild)
                }

                // modify title
                let dataTitle = ''
                const firstTitle = dom.querySelectorAll('title')[0]
                const firstTitleInner = firstTitle.innerHTML
                dataTitle = config.meta.title.prepend !== '' ? config.meta.title.prepend.trim() : '' + firstTitleInner + config.meta.title.append ? ` ${config.meta.title.append}` : ''

                // console.log(firstTitleInner)
                // console.log(req.url);
                if (req.url !== '/' && isbot === true) {
                  // console.log(isbot)
                  dataTitle = `${dataSetting.webName} ${firstTitleInner}`
                } else {
                  dataTitle = config.meta.title.prepend !== '' ? config.meta.title.prepend + ' ' + firstTitleInner + ' ' + config.meta.title.append : firstTitleInner
                }

                // dom.querySelectorAll("title").forEach(function (a) {
                //   dataTitle = a.innerHTML;
                //   console.log(dataTitle);
                //   a.remove();
                // });

                // console.log(isbot(request.getHeader("User-Agent")));
                const createTitle = dom.createElement('title')
                dataTitle = decodeURI(dataTitle)
                createTitle.innerHTML = dataTitle + '\n'
                dom.head.insertBefore(createTitle, dom.head.firstChild)

                // let ogDataTitle = "";
                // dom.querySelectorAll('meta[property="og:title"]').forEach(a => {
                //   ogDataTitle.innerHTML = a.innerHTML
                //   a.remove()
                // })
                // let createOgTitle = dom.createElement('meta')
                // dom.head.insertBefore(createOgTitle, dom.head.appendChild)

                const domBody = dom.body.outerHTML
                let dataReplace = []
                // eslint-disable-next-line no-unused-vars
                const dataReplaceElementValue = []
                if (dataSetting.replace_element_value) {
                  // console.log(a.replace_element_value)
                  dataSetting.replace_element_value.forEach((b) => {
                    // console.log(b)
                    // dom.querySelectorAll(b.target).forEach((c) => {
                    //   c.innerHTML = b.replace;
                    // });
                  })
                  // dataReplaceElementValue = a.replace_element_value;
                }

                dataSetting.costom_element_remove.forEach(function (a) {
                  if (hostname.includes(a.target)) {
                    // if (a.replace_string_rules) {
                    //   dom = dom.documentElement.outerHTML
                    //   a.replace_string_rules.forEach(function (b) {
                    //     // console.log("replace" + b);
                    //     dom = dom.replaceAll(b.target, b.replace)
                    //   })
                    // }
                    if (a.element_remove_selector) {
                      a.element_remove_selector.forEach(function (b) {
                        dom.querySelectorAll(b).forEach(function (c) {
                          c.remove()
                        })
                      })
                    }

                    dataReplace = a.replace_string

                    if (dataSetting.remove_encrypted_scripts) {
                      dom.querySelectorAll('script').forEach((sc) => {
                        if (sc.outerHTML.includes('var _0x')) {
                          sc.remove()
                        }
                        // console.log(a)
                        if (a.replace_script_contains) {
                          a.replace_script_contains.forEach((b) => {
                            if (sc.outerHTML.includes(b)) {
                              sc.remove()
                            }
                          })
                        }
                      })
                    }

                    // let lastScript = scripts[scripts.length - 1]
                    // console.log(lastScript.outerHTML)
                    /**
                     * replace element module
                     * ndowerdev
                     *
                     */
                    if (a.replace_string_rules) {
                      a.replace_string_rules.forEach(function (b) {
                        dom.head.outerHTML = dom.head.outerHTML.replace(
                          b.target,
                          b.replace
                        )
                      })
                    }

                    if (a.replace_element_value) {
                      // console.log(a.replace_element_value)
                      a.replace_element_value.forEach((b) => {
                        dom.querySelectorAll(b.target).forEach((c) => {
                          c.innerHTML = b.replace
                        })
                      })
                      // dataReplaceElementValue = a.replace_element_value;
                    }
                  }
                })
                let textBody =
                  dom.documentElement.querySelector('body').textContent

                let dataDescription = []
                for (let i = 3; i < 10; i++) {
                  textBody = textBody
                    .replace(/\n/g, '')
                    // .replace(/[`~!@#$%^&*()_\-+=\[\]{};:'"\\|\/<>?\s]/g, ' ')
                    .replace(/[`~!@#$%^&*()_\-+=[\]{};:'"\\|/<>?\s]/g, ' ')
                    .replace(/ {2}/g, ' ')
                }
                textBody = textBody.split(' ')
                textBody.forEach(function (a, i) {
                  if (a.length >= 3) {
                    if (i > 10 && i < 50) {
                      dataDescription.push(a)
                    }
                  }
                })
                if (dataDescription.length > 0) {
                  // dataDescription = dataDescription.join(" ");
                  dataDescription = dataDescription
                    .join(' ')
                    .replace('adsbygoogle window.adsbygoogle .push', '')
                } else {
                  dataDescription = ''
                }

                dom = dom.documentElement.outerHTML

                dataSetting.costom_element_remove.forEach(function (a) {
                  if (hostname.includes(a.target)) {
                    if (a.replace_string_rules) {
                      a.replace_string_rules.forEach(function (b) {
                        // console.log("replace" + b);
                        dom = dom.replaceAll(b.target, b.replace)
                      })
                    }
                  }
                })

                if (dataSetting.remove_comment_html) {
                  removeHtmlComments(domBody).comments.forEach(function (a) {
                    dom = dom.replace(a, '')
                  })
                }
                if (dataReplace) {
                  dataReplace.forEach(function (a) {
                    dom = dom.replaceAll(a.target, a.replace)
                  })
                }

                // console.log(dataSetting)
                dataSetting.replaceString.forEach(function (b) {
                  // console.log("replace" + b);
                  dom = dom.replaceAll(b.target, b.replace)
                })

                dom = dom.replace(/\$\{titlePost\}/g, dataTitle)
                dom = dom.replace(/\$\{urlPost\}/g, fullUrl)
                dom = dom.replace(/\$\{nameWeb\}/g, dataSetting.webName)
                dom = dom.replace(
                  /\$\{nameWebAlt\}/g,
                  dataSetting.webNameAlt
                )
                dom = dom.replace(/\$\{host\}/g, dataSetting.host)
                dom = dom.replace(/\$\{target\}/g, dataSetting.target)
                dom = dom.replace(
                  /\$\{timePublish\}/g,
                  new Date().toISOString()
                )
                dom = dom.replace(/\$\{authorPost\}/g, dataSetting.author)
                dom = dom.replace(
                  /\$\{descriptionPost\}/g,
                  dataDescription + '...'
                )

                /**
                 * add trim whitespace
                 */
                // dom = minify(dom, settings.minify_options)
                // console.log(dom)
                // dom = dom.replace(/^\s+|\s+$/gm, '')

                dom = '<!DOCTYPE html>' + dom
                gzip(dom)
                  .then((compressed) => {
                    res.write(compressed)
                    res.end()
                  })
                  .catch(function (e) {
                    res.end('404g')
                  })
              }
            } else {
              if (codeContent === 404) {
                res.end('404h')
              } else {
                // check content image
                // console.log("--------")
                if (
                  typeContent.indexOf('image/') === 0 ||
                  typeContent.indexOf('font/') === 0
                ) {
                  unirest.request({
                    uri: linkPost,
                    headers: headerDafult,
                    gzip: true
                  }).on('error', (error) => {
                    console.log(error)
                    res.end('404i')
                  }).pipe(res)
                } else if (
                  typeContent.indexOf('application/atom+xml') === 0 ||
                  typeContent.indexOf('application/xml') === 0 ||
                  typeContent.indexOf('text/xml') === 0 ||
                  typeContent.indexOf('application/xslt+xml') === 0 ||
                  req.url.indexOf('.xsl') > 0
                ) {
                  // --  page xml host ----------
                  // console.log(linkPost)
                  let dataXML = ''
                  const getContent = unirest
                    .request({
                      uri: linkPost,
                      headers: headerDafult,
                      gzip: true
                    })
                    .on('error', (error) => {
                      console.log(error)
                      res.end('404j')
                    })
                  getContent.on('data', function (data) {
                    dataXML = dataXML + data
                  })
                  getContent.on('end', function () {
                    try {
                      const hostname = '//' + parseUrl(linkPost).hostname
                      let re = new RegExp(dataSetting.target, 'g')
                      const re2 = new RegExp(hostname, 'g')

                      if (statusOrigin === false) {
                        re = new RegExp(parseUrl(linkPost).origin, 'g')
                      }
                      dataXML = dataXML.replace(
                        re,
                        originUrl + '/' + dataOrigin
                      )

                      dataXML = dataXML.replace(
                        re2,
                        originUrl + '/' + dataOrigin
                      )
                      if (hostname.indexOf('www') === -1) {
                        let re3 = hostname.replace('//', '//www.')
                        // eslint-disable-next-line no-unused-vars
                        re3 = new RegExp(re3, 'g')
                        // console.log(re3)
                      } else {
                        let re3 = hostname.replace('//www.', '//')
                        re3 = new RegExp(re3, 'g')
                        dataXML = dataXML.replace(
                          re3,
                          originUrl + '/' + dataOrigin
                        )
                      }
                      // console.log(dataXML)
                      // const re4 = new RegExp('https:http', 'g')
                      // const re5 = new RegExp('https:https', 'g')
                      // const re6 = new RegExp('http:https', 'g')
                      // const re7 = new RegExp('http:http', 'g')
                      const re4 = /https:http/g
                      const re5 = /https:https/g
                      const re6 = /http:https/g
                      const re7 = /http:http/g
                      dataXML = dataXML.replace(re4, 'http')
                      dataXML = dataXML.replace(re5, 'https')
                      dataXML = dataXML.replace(re6, 'https')
                      dataXML = dataXML.replace(re7, 'http')

                      res.writeHead(200, {
                        'content-type': typeContent
                      })

                      res.end(dataXML)
                    } catch (e) {
                      res.end('404k')
                    }
                  })
                } else if (typeContent.indexOf('text/css') === 0) {
                  // --------- assets css host ---------
                  let dataCSS = ''
                  const getContent = unirest
                    .request({
                      uri: linkPost,
                      headers: headerDafult,
                      gzip: true
                    })
                    .on('error', (error) => {
                      console.log(error)
                      res.end('404l')
                    })
                  getContent.on('data', function (data) {
                    dataCSS = dataCSS + data
                  })
                  getContent.on('end', function () {
                    res.writeHead(200, resOriginHeader)
                    // console.log(dataCSS);
                    res.end(dataCSS)
                  })
                } else {
                  // console.log(resOriginHeader);
                  // console.log(codeContent);
                  // console.log(typeContent);
                  // console.log("1")
                  res.end('404m')
                }
              }
            }
          }
        } else {
          // console.log("3")
          res.end('404n')
        }
      } catch (e) {
        console.log(e)
        // console.log("4")
        res.end('404o')
      }
    } else {
      // console.log("5")
      res.end('404p')
    }
  } catch (e) {
    res.send(e.toString())
  }
}
