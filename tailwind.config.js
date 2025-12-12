// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  // 1. Specify which files Tailwind should scan for utility classes
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    // 2. Extend the default theme
    extend: {
      colors: {
        // 3. Define the 'border' color token
        // This is what allows you to use the 'border-border' utility class.
        // It maps the name 'border' to a CSS variable '--border'.
        border: 'hsl(var(--border))', 
      },
      // You may need other extensions here depending on your project...
    },
  },
  plugins: [],
}