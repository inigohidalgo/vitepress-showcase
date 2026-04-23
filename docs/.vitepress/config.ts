import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'VitePress Showcase',
  description: 'A VitePress cheatsheet that documents itself, oriented toward data-platform docs.',
  base: '/vitepress-showcase/',
  lastUpdated: true,
  cleanUrls: false,
  ignoreDeadLinks: true,

  markdown: {
    lineNumbers: true,
    math: true,
    image: { lazyLoading: true }
  },

  themeConfig: {
    siteTitle: 'VitePress Showcase',

    nav: [
      { text: 'Home', link: '/' },
      { text: 'Cheatsheet', link: '/cheatsheet' },
      {
        text: 'Demos',
        items: [
          { text: 'Dynamic routes (tables)', link: '/tables/' },
          { text: 'Changelog (data loader)', link: '/changelog/' },
          { text: 'Team page', link: '/team' }
        ]
      }
    ],

    sidebar: {
      '/': [
        {
          text: 'Reference',
          items: [{ text: 'Cheatsheet', link: '/cheatsheet' }]
        },
        {
          text: 'Live demos',
          items: [
            {
              text: 'Dynamic routes',
              link: '/tables/',
              collapsed: true,
              items: [
                { text: 'fct_orders', link: '/tables/fct_orders' },
                { text: 'dim_customers', link: '/tables/dim_customers' },
                { text: 'ml_feature_store', link: '/tables/ml_feature_store' }
              ]
            },
            { text: 'Changelog', link: '/changelog/' },
            { text: 'Team page', link: '/team' }
          ]
        }
      ]
    },

    outline: { level: [2, 3], label: 'On this page' },

    search: { provider: 'local' },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/inigohidalgo/vitepress-showcase' }
    ],

    editLink: {
      pattern: 'https://github.com/inigohidalgo/vitepress-showcase/edit/main/docs/:path',
      text: 'Suggest an edit'
    },

    footer: {
      message: 'Built with VitePress — a showcase, not a distribution.',
      copyright: '© VitePress Showcase'
    }
  }
})
