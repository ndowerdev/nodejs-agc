/* eslint-disable no-template-curly-in-string */
module.exports = {
  target: 'anekatempe.web.app',
  element_remove_selector: ['.navbar-logo', 'script[src*="googletagmanager"]', 'div.nav-secondary'],
  replace_script_contains: ['gtag'],
  replace_string_rules: [
    {
      target: 'https://www.funcoding.xyz/',
      replace: 'https://google.com/'
    }
  ],
  replace_element_value: [
    {
      target: 'a.navbar-brand',
      replace: '${nameWeb}'
    },
    {
      target: '.navbar-caption',
      replace: '${nameWeb}'
    },
    {
      target: '#footer7-3 p > a',
      replace: '${nameWeb}'
    }
  ],
  replace_string: [
    {
      target: 'resep2026',
      replace: '${nameWeb}'
    }
  ]
}
