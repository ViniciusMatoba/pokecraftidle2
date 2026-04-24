/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Cores clássicas de Pokémon
        pokeRed: '#FF0000',
        pokeBlue: '#3B4CCA',
        pokeYellow: '#FFDE00',
        pokeGold: '#B3A125',
        // Tons de interface (Game Boy / Moderno)
        menuBg: '#F0F0F0', // Fundo claro clássico
        panelDark: '#303030', // Painéis escuros de contraste
        grass: '#48D0B0', // Verde clássico de grama
      },
      backgroundImage: {
        'poke-pattern': "url('https://www.transparenttextures.com/patterns/cubes.png')",
      }
    },
  },
  plugins: [],
}
