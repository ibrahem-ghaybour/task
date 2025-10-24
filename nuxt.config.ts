export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  ssr: false,
  css:['vue-sonner/style.css'],
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', 'shadcn-nuxt', '@pinia/nuxt'],
  shadcn: {
    prefix: '',
    componentDir: './components/ui'
  },
  runtimeConfig: {
    public: {
      apiBaseUrl: 'https://freestore.ezeestock.com/api'
    }
  }
})