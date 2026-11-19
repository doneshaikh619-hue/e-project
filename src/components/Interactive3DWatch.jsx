import React, { useState, useRef, useEffect } from 'react';
import { RotateCw, ZoomIn, Eye, Sparkles, Compass } from 'lucide-react';

export default function Interactive3DWatch({ watch }) {
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [activeView, setActiveView] = useState('dial'); // 'dial', 'caseback', 'crown'
  const [autoRotate, setAutoRotate] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [loupePos, setLoupePos] = useState({ x: 0, y: 0, show: false });
  const containerRef = useRef(null);

  // Auto rotation effect
  useEffect(() => {
    if (!autoRotate || isDragging) return;
    const interval = setInterval(() => {
      setRotationAngle(prev => (prev + 0.3) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, [autoRotate, isDragging]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setAutoRotate(false);
    setDragStartX(e.clientX);
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const delta = e.clientX - dragStartX;
      setRotationAngle(prev => (prev + delta * 0.5) % 360);
      setDragStartX(e.clientX);
    }

    // Loupe magnifier calculations
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        setLoupePos({ x, y, show: true });
      } else {
        setLoupePos(prev => ({ ...prev, show: false }));
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const currentImage = watch?.images?.[activeView === 'dial' ? 0 : activeView === 'caseback' ? 1 : 2] || watch?.images?.[0];

  return (
    <div className="relative glass-card rounded-2xl p-6 sm:p-8 overflow-hidden select-none border border-luxury-gold/30">
      {/* Header controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-white/10">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs uppercase tracking-widest text-luxury-gold font-bold">
            Interactive 360° Haute Horlogerie Viewer
          </span>
        </div>
        <div className="flex items-center space-x-2 text-xs">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`px-3 py-1 rounded-full border transition-all flex items-center space-x-1.5 ${
              autoRotate
                ? 'bg-luxury-gold/20 border-luxury-gold text-luxury-gold'
                : 'bg-white/5 border-white/20 text-slate-400'
            }`}
          >
            <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
            <span>{autoRotate ? 'Rotating' : 'Paused'}</span>
          </button>
          <div className="hidden sm:flex items-center space-x-1 bg-white/5 p-1 rounded-full border border-white/10">
            <button
              onClick={() => setActiveView('dial')}
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-all ${
                activeView === 'dial' ? 'bg-luxury-gold text-luxury-950 font-bold' : 'text-slate-300'
              }`}
            >
              Dial 0°
            </button>
            <button
              onClick={() => setActiveView('caseback')}
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-all ${
                activeView === 'caseback' ? 'bg-luxury-gold text-luxury-950 font-bold' : 'text-slate-300'
              }`}
            >
              Exhibition 180°
            </button>
            <button
              onClick={() => setActiveView('crown')}
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-all ${
                activeView === 'crown' ? 'bg-luxury-gold text-luxury-950 font-bold' : 'text-slate-300'
              }`}
            >
              Profile 90°
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => { handleMouseUp(); setLoupePos(prev => ({ ...prev, show: false })); }}
        className="relative h-[340px] sm:h-[420px] flex items-center justify-center cursor-grab active:cursor-grabbing overflow-hidden group"
      >
        {/* Ambient Halo Glow */}
        <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-luxury-gold/15 blur-3xl -z-10 animate-pulse-slow" />

        {/* 360 Degree Dial Canvas Frame */}
        <div
          className="relative transition-transform duration-75 ease-out max-w-full"
          style={{
            transform: `perspective(1000px) rotateY(${rotationAngle}deg) scale(${zoomLevel})`,
          }}
        >
          <img
            src={currentImage}
            alt={watch?.name}
            className="w-64 h-64 sm:w-80 sm:h-80 object-cover rounded-full shadow-2xl border-4 border-luxury-gold/40 ring-8 ring-luxury-950/80 pointer-events-none"
          />

          {/* Luxury Metallic Light Glare Reflex */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none opacity-30 mix-blend-overlay"
            style={{
              background: `linear-gradient(${rotationAngle * 2}deg, rgba(255,255,255,0.8) 0%, transparent 40%, rgba(212,175,55,0.6) 100%)`
            }}
          />

          {/* Horology Calibre Watermark Overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-56 h-56 rounded-full border border-luxury-gold/20 flex items-center justify-center">
              <div className="w-40 h-40 rounded-full border border-luxury-gold/15" />
            </div>
          </div>
        </div>

        {/* Optical Precision Loupe Magnifier Follower */}
        {loupePos.show && (
          <div
            className="hidden md:block absolute w-36 h-36 rounded-full border-2 border-luxury-gold shadow-gold-glow pointer-events-none overflow-hidden z-20 backdrop-blur-none bg-luxury-900/90"
            style={{
              left: `${loupePos.x - 72}px`,
              top: `${loupePos.y - 72}px`,
            }}
          >
            <div
              className="w-[800px] h-[800px] absolute"
              style={{
                backgroundImage: `url(${currentImage})`,
                backgroundSize: 'cover',
                backgroundPosition: `${(loupePos.x / (containerRef.current?.offsetWidth || 1)) * 100}% ${(loupePos.y / (containerRef.current?.offsetHeight || 1)) * 100}%`,
                transform: 'scale(1.8)',
                transformOrigin: 'center'
              }}
            />
            {/* Loupe crosshairs */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-full h-[1px] bg-luxury-gold/40" />
              <div className="h-full w-[1px] bg-luxury-gold/40 absolute" />
            </div>
          </div>
        )}

        {/* Drag Instruction Overlay */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-luxury-950/80 border border-luxury-gold/25 backdrop-blur-md text-[10px] uppercase tracking-widest text-slate-300 flex items-center space-x-2 pointer-events-none">
          <RotateCw className="w-3 h-3 text-luxury-gold" />
          <span>Click & Drag to rotate 360° • Hover to inspect dial</span>
        </div>
      </div>

      {/* Footer Specs Ticker */}
      <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <div className="p-2 rounded-xl bg-white/5">
          <span className="text-[10px] uppercase text-slate-400 block tracking-wider">Calibre Movement</span>
          <span className="text-xs font-semibold text-luxury-gold truncate block">{watch?.movement?.split(' ')[0] || 'Automatic'}</span>
        </div>
        <div className="p-2 rounded-xl bg-white/5">
          <span className="text-[10px] uppercase text-slate-400 block tracking-wider">Case Dimension</span>
          <span className="text-xs font-semibold text-slate-200 block">{watch?.caseSize || '40 mm'}</span>
        </div>
        <div className="p-2 rounded-xl bg-white/5">
          <span className="text-[10px] uppercase text-slate-400 block tracking-wider">Power Reserve</span>
          <span className="text-xs font-semibold text-slate-200 block">{watch?.powerReserve || '72 Hours'}</span>
        </div>
        <div className="p-2 rounded-xl bg-white/5">
          <span className="text-[10px] uppercase text-slate-400 block tracking-wider">Waterproofness</span>
          <span className="text-xs font-semibold text-emerald-400 block">{watch?.waterResistance || '100m'}</span>
        </div>
      </div>
    </div>
  );
}
