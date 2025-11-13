import React from 'react'
import { createRoot } from 'react-dom/client'
import { createInertiaApp } from '@inertiajs/react'

// Import styles (we'll add later)
import '../styles/application.css'

// Setup Inertia
createInertiaApp({
  resolve: (name) => {
    const pages = (import.meta as any).glob('../Pages/**/*.tsx', { eager: true });
    const page = pages[`../Pages/${name}.tsx`];
    if (!page) {
      throw new Error(`Page not found: ${name}`);
    }
    return page;
  },

  setup({ el, App, props }) {
    createRoot(el).render(
      <React.StrictMode>
        <App {...props} />
      </React.StrictMode>
    )
  },
})