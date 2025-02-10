import daisyui from 'daisyui';
import daisyUITheme from 'daisyui/src/themes';

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {},
  },
  plugins: [
    daisyui,
  ],
  daisyui: {
    themes: [
      "light",
      {
        dark:{
          ...daisyUITheme["dark"],
          primary: "#ffffff"
        }
      }
    ]
  }
}

