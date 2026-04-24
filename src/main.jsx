import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './AppRoot.jsx'

function DesktopBackground() {
  const balls = [
    { src: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png',    style: { top: '8%',  left: '6%',  width: 80,  animationDelay: '0s', animationDuration: '9s'  } },
    { src: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/ultra-ball.png',   style: { top: '70%', left: '3%',  width: 100, animationDelay: '2s', animationDuration: '12s' } },
    { src: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/great-ball.png',   style: { top: '40%', left: '2%',  width: 60,  animationDelay: '4s', animationDuration: '8s'  } },
    { src: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/master-ball.png',  style: { top: '15%', right: '5%', width: 110, animationDelay: '1s', animationDuration: '14s' } },
    { src: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/premier-ball.png', style: { top: '60%', right: '4%', width: 70,  animationDelay: '3s', animationDuration: '10s' } },
    { src: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png',    style: { top: '85%', right: '8%', width: 55,  animationDelay: '5s', animationDuration: '11s' } },
    { src: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/ultra-ball.png',   style: { top: '30%', right: '2%', width: 45,  animationDelay: '6s', animationDuration: '7s'  } },
  ];

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, display: 'none' }} className="desktop-bg-balls">
      {balls.map((b, i) => (
        <img key={i} src={b.src} alt="" style={{
          position: 'absolute', width: b.style.width, opacity: 0.15,
          imageRendering: 'pixelated',
          animation: `float-slow ${b.style.animationDuration} ease-in-out infinite ${b.style.animationDelay}`,
          ...b.style,
        }} />
      ))}
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DesktopBackground />
    <App />
  </StrictMode>,
)
