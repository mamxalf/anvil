import React from 'react'
import { createRoot } from 'react-dom/client'
import { createInertiaApp } from '@inertiajs/react'

// Import styles (we'll add later)
import '../styles/application.css'

// Setup Inertia
createInertiaApp({
  resolve: (name) => {
    const pages = (import.meta as any).glob('../Pages/**/*.tsx', { eager: true })
    const page = pages[`../Pages/${name}.tsx`]
    if (!page) {
      throw new Error(`Page not found: ${name}`)
    }

    // Check if the page component has a layout property
    const PageComponent = page.default
    if (PageComponent && PageComponent.layout) {
      // Wrap the page with its layout
      const LayoutWrapper = PageComponent.layout
      return {
        default: (props: any) => LayoutWrapper(<PageComponent {...props} />),
      }
    }

    return page
  },

  setup({ el, App, props }) {
    createRoot(el).render(
      <React.StrictMode>
        <App {...props} />
      </React.StrictMode>
    )
  },
})
