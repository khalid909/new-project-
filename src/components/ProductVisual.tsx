import React from 'react';
import { Product } from '../types';

interface ProductVisualProps {
  product: Product;
  className?: string;
  isDetailed?: boolean;
}

export const ProductVisual: React.FC<ProductVisualProps> = ({ product, className = '', isDetailed = false }) => {
  // Return crafted luxury art tailored for each category
  const renderVisualArtwork = () => {
    switch (product.category) {
      case 'watches':
        return (
          <div className="relative w-full h-full flex items-center justify-center p-6 select-none overflow-hidden">
            {/* Background subtle radial aura */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.15)_0%,transparent_70%)]" />
            
            {/* SVG Watch Chronometer */}
            <svg viewBox="0 0 300 300" className="w-4/5 h-4/5 drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)] transition-transform duration-500 group-hover:scale-105">
              <defs>
                <linearGradient id={`bezel-grad-${product.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#52525b" />
                  <stop offset="50%" stopColor="#27272a" />
                  <stop offset="100%" stopColor="#71717a" />
                </linearGradient>
                <linearGradient id={`gold-ring-${product.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#d4af37" />
                  <stop offset="50%" stopColor="#854d0e" />
                  <stop offset="100%" stopColor="#fef08a" />
                </linearGradient>
                <radialGradient id={`dial-grad-${product.id}`} cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#18181b" />
                  <stop offset="90%" stopColor="#09090b" />
                  <stop offset="100%" stopColor="#000000" />
                </radialGradient>
              </defs>

              {/* Watch Straps */}
              <rect x="110" y="10" width="80" height="70" rx="6" fill="#18181b" stroke="#27272a" strokeWidth="2" />
              <line x1="110" y1="35" x2="190" y2="35" stroke="#3f3f46" strokeDasharray="4 3" />
              <line x1="110" y1="55" x2="190" y2="55" stroke="#3f3f46" strokeDasharray="4 3" />

              <rect x="110" y="220" width="80" height="70" rx="6" fill="#18181b" stroke="#27272a" strokeWidth="2" />
              <line x1="110" y1="245" x2="190" y2="245" stroke="#3f3f46" strokeDasharray="4 3" />
              <line x1="110" y1="265" x2="190" y2="265" stroke="#3f3f46" strokeDasharray="4 3" />

              {/* Watch Case & Lugs */}
              <path d="M95 65 L205 65 L215 110 L215 190 L205 235 L95 235 L85 190 L85 110 Z" fill={`url(#bezel-grad-${product.id})`} stroke="#3f3f46" strokeWidth="1.5" />
              
              {/* Crown / Pushers */}
              <rect x="235" y="135" width="16" height="30" rx="3" fill="#a1a1aa" />
              <rect x="230" y="98" width="12" height="18" rx="2" fill="#71717a" />
              <rect x="230" y="184" width="12" height="18" rx="2" fill="#71717a" />

              {/* Outer Bezel */}
              <circle cx="150" cy="150" r="92" fill={`url(#bezel-grad-${product.id})`} stroke="#71717a" strokeWidth="1" />
              <circle cx="150" cy="150" r="88" fill="none" stroke={`url(#gold-ring-${product.id})`} strokeWidth="1.5" />
              
              {/* Dial Face */}
              <circle cx="150" cy="150" r="84" fill={`url(#dial-grad-${product.id})`} />

              {/* Hour Indices */}
              {[...Array(12)].map((_, i) => {
                const angle = (i * 30 * Math.PI) / 180;
                const x1 = 150 + Math.sin(angle) * 72;
                const y1 = 150 - Math.cos(angle) * 72;
                const x2 = 150 + Math.sin(angle) * 80;
                const y2 = 150 - Math.cos(angle) * 80;
                return (
                  <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#e4e4e7" strokeWidth={i % 3 === 0 ? "2.5" : "1.2"} />
                );
              })}

              {/* Sub-dials (Chronograph) */}
              <circle cx="120" cy="150" r="22" fill="#141416" stroke="#3f3f46" strokeWidth="1" />
              <line x1="120" y1="150" x2="132" y2="142" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round" />
              
              <circle cx="180" cy="150" r="22" fill="#141416" stroke="#3f3f46" strokeWidth="1" />
              <line x1="180" y1="150" x2="172" y2="160" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round" />

              {/* Brand Hallmark */}
              <text x="150" y="115" textAnchor="middle" fill="#d4af37" fontSize="8" fontWeight="600" letterSpacing="1.5" fontFamily="serif">GENÈVE</text>
              <text x="150" y="196" textAnchor="middle" fill="#71717a" fontSize="6" letterSpacing="1">CHRONOMETRE</text>

              {/* Watch Hands */}
              <line x1="150" y1="150" x2="122" y2="120" stroke="#f4f4f5" strokeWidth="3.5" strokeLinecap="round" />
              <line x1="150" y1="150" x2="185" y2="105" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
              {/* Second hand in Gold */}
              <line x1="150" y1="165" x2="150" y2="82" stroke="#d4af37" strokeWidth="1.2" strokeLinecap="round" />
              <circle cx="150" cy="150" r="4.5" fill="#d4af37" />
              <circle cx="150" cy="150" r="1.5" fill="#09090b" />
            </svg>
          </div>
        );

      case 'interiors':
        return (
          <div className="relative w-full h-full flex items-center justify-center p-6 select-none overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(217,119,6,0.12)_0%,transparent_75%)]" />
            <svg viewBox="0 0 300 300" className="w-4/5 h-4/5 drop-shadow-[0_20px_35px_rgba(0,0,0,0.7)] transition-transform duration-500 group-hover:scale-105">
              <defs>
                <linearGradient id={`boucle-grad-${product.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f5f5f4" />
                  <stop offset="70%" stopColor="#e7e5e4" />
                  <stop offset="100%" stopColor="#d6d3d1" />
                </linearGradient>
                <linearGradient id={`wood-grad-${product.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#78350f" />
                  <stop offset="100%" stopColor="#451a03" />
                </linearGradient>
              </defs>

              {/* Floor Shadow */}
              <ellipse cx="150" cy="265" rx="90" ry="14" fill="#000000" opacity="0.6" />

              {/* Wooden Legs */}
              <path d="M90 200 L72 262 L82 264 L98 202 Z" fill={`url(#wood-grad-${product.id})`} />
              <path d="M210 200 L228 262 L218 264 L202 202 Z" fill={`url(#wood-grad-${product.id})`} />
              <path d="M125 210 L120 258 L128 260 L132 210 Z" fill={`url(#wood-grad-${product.id})`} opacity="0.8" />
              <path d="M175 210 L180 258 L172 260 L168 210 Z" fill={`url(#wood-grad-${product.id})`} opacity="0.8" />

              {/* Main Seat Cushion */}
              <ellipse cx="150" cy="190" rx="78" ry="32" fill={`url(#boucle-grad-${product.id})`} stroke="#e7e5e4" strokeWidth="1" />
              
              {/* Ergonomic Curved Backrest */}
              <path d="M72 170 C70 90, 100 60, 150 60 C200 60, 230 90, 228 170 C220 200, 180 205, 150 205 C120 205, 80 200, 72 170 Z" 
                    fill={`url(#boucle-grad-${product.id})`} 
                    stroke="#d6d3d1" 
                    strokeWidth="1.5" />

              {/* Inner Cocoon Shading */}
              <path d="M92 165 C90 105, 115 82, 150 82 C185 82, 210 105, 208 165 C200 185, 175 190, 150 190 C125 190, 100 185, 92 165 Z" 
                    fill="#e7e5e4" 
                    opacity="0.6" />

              {/* Bouclé Texture Hints */}
              <circle cx="130" cy="120" r="1.5" fill="#a8a29e" opacity="0.4" />
              <circle cx="170" cy="115" r="1.5" fill="#a8a29e" opacity="0.4" />
              <circle cx="150" cy="140" r="1.5" fill="#a8a29e" opacity="0.4" />
              <circle cx="140" cy="175" r="1.5" fill="#a8a29e" opacity="0.4" />
            </svg>
          </div>
        );

      case 'fragrance':
        return (
          <div className="relative w-full h-full flex items-center justify-center p-6 select-none overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(180,83,9,0.2)_0%,transparent_70%)]" />
            <svg viewBox="0 0 300 300" className="w-4/5 h-4/5 drop-shadow-[0_25px_45px_rgba(0,0,0,0.85)] transition-transform duration-500 group-hover:scale-105">
              <defs>
                <linearGradient id={`liquid-grad-${product.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                  <stop offset="60%" stopColor="#b45309" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#451a03" />
                </linearGradient>
                <linearGradient id={`glass-rim-${product.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
                  <stop offset="20%" stopColor="#ffffff" stopOpacity="0.05" />
                  <stop offset="80%" stopColor="#ffffff" stopOpacity="0.05" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0.5" />
                </linearGradient>
                <linearGradient id={`gold-cap-${product.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fef08a" />
                  <stop offset="35%" stopColor="#d4af37" />
                  <stop offset="80%" stopColor="#854d0e" />
                  <stop offset="100%" stopColor="#eab308" />
                </linearGradient>
              </defs>

              {/* Pedestal Shadow */}
              <ellipse cx="150" cy="270" rx="75" ry="12" fill="#000000" opacity="0.75" />

              {/* Travertine Base */}
              <rect x="80" y="255" width="140" height="20" rx="3" fill="#292524" stroke="#44403c" strokeWidth="1" />

              {/* Glass Flacon Bottle Body */}
              <rect x="100" y="110" width="100" height="145" rx="14" fill="#0c0a09" stroke="#78716c" strokeWidth="1" />
              
              {/* Amber Liquid */}
              <rect x="105" y="130" width="90" height="118" rx="8" fill={`url(#liquid-grad-${product.id})`} />
              
              {/* Glass Highlights */}
              <rect x="100" y="110" width="100" height="145" rx="14" fill={`url(#glass-rim-${product.id})`} />

              {/* Luxury Label */}
              <rect x="115" y="150" width="70" height="65" rx="2" fill="#1c1917" stroke="#d4af37" strokeWidth="1" />
              <text x="150" y="172" textAnchor="middle" fill="#d4af37" fontSize="8" fontWeight="bold" letterSpacing="1.8">KHAMRAH</text>
              <line x1="128" y1="178" x2="172" y2="178" stroke="#d4af37" strokeWidth="0.8" />
              <text x="150" y="192" textAnchor="middle" fill="#fafaf9" fontSize="6" letterSpacing="1">EXTRAIT DE PARFUM</text>
              <text x="150" y="204" textAnchor="middle" fill="#a8a29e" fontSize="5" letterSpacing="0.8">100 ML</text>

              {/* Bottle Neck */}
              <rect x="136" y="90" width="28" height="20" rx="2" fill={`url(#gold-cap-${product.id})`} />

              {/* Heavy Solid Brass Cap */}
              <rect x="125" y="45" width="50" height="46" rx="6" fill={`url(#gold-cap-${product.id})`} stroke="#fef08a" strokeWidth="0.8" />
              <line x1="125" y1="68" x2="175" y2="68" stroke="#854d0e" strokeWidth="1" />
            </svg>
          </div>
        );

      case 'leather':
        return (
          <div className="relative w-full h-full flex items-center justify-center p-6 select-none overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(180,83,9,0.18)_0%,transparent_70%)]" />
            <svg viewBox="0 0 300 300" className="w-4/5 h-4/5 drop-shadow-[0_22px_40px_rgba(0,0,0,0.85)] transition-transform duration-500 group-hover:scale-105">
              <defs>
                <linearGradient id={`leather-grad-${product.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#9a3412" />
                  <stop offset="60%" stopColor="#7c2d12" />
                  <stop offset="100%" stopColor="#451a03" />
                </linearGradient>
                <linearGradient id={`brass-grad-${product.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fef08a" />
                  <stop offset="50%" stopColor="#d4af37" />
                  <stop offset="100%" stopColor="#a16207" />
                </linearGradient>
              </defs>

              {/* Shadow */}
              <ellipse cx="150" cy="265" rx="100" ry="14" fill="#000000" opacity="0.75" />

              {/* Leather Handles Back */}
              <path d="M110 135 C110 50, 190 50, 190 135" fill="none" stroke="#451a03" strokeWidth="14" strokeLinecap="round" />

              {/* Main Duffle Body */}
              <path d="M60 170 C55 125, 80 120, 150 120 C220 120, 245 125, 240 170 L235 245 C235 255, 225 258, 215 258 L85 258 C75 258, 65 255, 65 245 Z" 
                    fill={`url(#leather-grad-${product.id})`} 
                    stroke="#431407" 
                    strokeWidth="1.5" />

              {/* Leather Trim Straps with Contrast Stitching */}
              <rect x="102" y="120" width="22" height="138" fill="#451a03" />
              <line x1="105" y1="125" x2="105" y2="252" stroke="#fdba74" strokeWidth="1.2" strokeDasharray="3 2" />
              <line x1="121" y1="125" x2="121" y2="252" stroke="#fdba74" strokeWidth="1.2" strokeDasharray="3 2" />

              <rect x="176" y="120" width="22" height="138" fill="#451a03" />
              <line x1="179" y1="125" x2="179" y2="252" stroke="#fdba74" strokeWidth="1.2" strokeDasharray="3 2" />
              <line x1="195" y1="125" x2="195" y2="252" stroke="#fdba74" strokeWidth="1.2" strokeDasharray="3 2" />

              {/* Top Heavy Brass Zipper */}
              <line x1="75" y1="130" x2="225" y2="130" stroke={`url(#brass-grad-${product.id})`} strokeWidth="3.5" />
              <circle cx="150" cy="130" r="5" fill={`url(#brass-grad-${product.id})`} />

              {/* Front Leather Handles */}
              <path d="M116 145 C116 65, 184 65, 184 145" fill="none" stroke="#7c2d12" strokeWidth="12" strokeLinecap="round" />
              <path d="M116 145 C116 65, 184 65, 184 145" fill="none" stroke="#fdba74" strokeWidth="1" strokeDasharray="4 2" />

              {/* Brass Rivets */}
              <circle cx="113" cy="165" r="3.5" fill={`url(#brass-grad-${product.id})`} />
              <circle cx="187" cy="165" r="3.5" fill={`url(#brass-grad-${product.id})`} />

              {/* Hand-Stamped Atelier Hallmark */}
              <rect x="135" y="180" width="30" height="18" rx="2" fill="#451a03" stroke="#9a3412" strokeWidth="0.5" />
              <text x="150" y="192" textAnchor="middle" fill="#fdba74" fontSize="5" letterSpacing="1" fontWeight="bold">FIRENZE</text>
            </svg>
          </div>
        );

      case 'audio':
      default:
        return (
          <div className="relative w-full h-full flex items-center justify-center p-6 select-none overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15)_0%,transparent_70%)]" />
            <svg viewBox="0 0 300 300" className="w-4/5 h-4/5 drop-shadow-[0_20px_40px_rgba(0,0,0,0.85)] transition-transform duration-500 group-hover:scale-105">
              <defs>
                <linearGradient id={`metal-grad-${product.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#475569" />
                  <stop offset="50%" stopColor="#1e293b" />
                  <stop offset="100%" stopColor="#64748b" />
                </linearGradient>
                <linearGradient id={`cyan-rim-${product.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#60a5fa" />
                  <stop offset="100%" stopColor="#2563eb" />
                </linearGradient>
              </defs>

              {/* Headband Steel Arch */}
              <path d="M75 160 C70 65, 230 65, 225 160" fill="none" stroke={`url(#metal-grad-${product.id})`} strokeWidth="12" strokeLinecap="round" />
              <path d="M90 145 C88 80, 212 80, 210 145" fill="none" stroke="#0f172a" strokeWidth="16" strokeLinecap="round" />

              {/* Left Cup Yoke */}
              <path d="M70 150 L70 190" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
              {/* Left Ear Cushion */}
              <rect x="52" y="165" width="22" height="75" rx="10" fill="#020617" stroke="#334155" strokeWidth="1" />
              {/* Left Open-Back Grille Shell */}
              <rect x="68" y="160" width="30" height="85" rx="14" fill={`url(#metal-grad-${product.id})`} stroke="#475569" strokeWidth="1" />
              {/* Honeycomb Acoustic Grill */}
              <circle cx="83" cy="202" r="14" fill="#0f172a" stroke={`url(#cyan-rim-${product.id})`} strokeWidth="1.5" />
              <circle cx="83" cy="202" r="8" fill="#1e293b" />

              {/* Right Cup Yoke */}
              <path d="M230 150 L230 190" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
              {/* Right Open-Back Grille Shell */}
              <rect x="202" y="160" width="30" height="85" rx="14" fill={`url(#metal-grad-${product.id})`} stroke="#475569" strokeWidth="1" />
              {/* Right Ear Cushion */}
              <rect x="226" y="165" width="22" height="75" rx="10" fill="#020617" stroke="#334155" strokeWidth="1" />
              {/* Right Honeycomb Grille */}
              <circle cx="217" cy="202" r="14" fill="#0f172a" stroke={`url(#cyan-rim-${product.id})`} strokeWidth="1.5" />
              <circle cx="217" cy="202" r="8" fill="#1e293b" />

              {/* Braided Silver Cable */}
              <path d="M83 245 C83 275, 130 280, 150 280 C170 280, 217 275, 217 245" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeDasharray="3 2" />
            </svg>
          </div>
        );
    }
  };

  return (
    <div
      className={`relative w-full aspect-[4/3] rounded-t-xl bg-gradient-to-b ${product.visualGradient} flex items-center justify-center overflow-hidden border-b border-neutral-800/80 group ${className}`}
    >
      {renderVisualArtwork()}
      
      {/* Luxury Spec Tag Overlay */}
      {product.accentBadge && (
        <div className="absolute top-3 start-3 px-2.5 py-1 text-[11px] font-medium tracking-wider text-amber-200/90 bg-neutral-950/80 backdrop-blur-md rounded border border-amber-500/20">
          {product.accentBadge}
        </div>
      )}
      
      {/* Inventory Indicator */}
      {product.stock <= 5 && (
        <div className="absolute top-3 end-3 px-2 py-0.5 text-[10px] font-mono tabular-nums text-amber-400 bg-amber-950/80 backdrop-blur-md rounded border border-amber-500/30">
          {product.stock} units remaining
        </div>
      )}
    </div>
  );
};
