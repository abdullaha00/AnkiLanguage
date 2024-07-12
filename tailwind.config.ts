import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
          './src/**/*.{html,jsx,tsx}',
      // you can either add all styles
      './node_modules/@rewind-ui/core/dist/theme/styles/*.js',
      // OR you can add only the styles you need
      './node_modules/@rewind-ui/core/dist/theme/styles/Button.styles.js',
     // './node_modules/@rewind-ui/core/dist/theme/styles/Text.styles.js'
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('tailwind-scrollbar')({ nocompatible: true }),
    require('@tailwindcss/forms')({
      strategy: 'class' // only generate classes
    })
  ],
};
export default config;
