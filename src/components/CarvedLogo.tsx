import React, { useState } from 'react';

/**
 * 4-pointed diamond star SVG exactly from sondaven.com/en (.title_stars .ico-8-12)
 */
export const DiamondStar: React.FC<{ className?: string }> = ({ className = 'w-2 h-2' }) => (
  <svg
    className={className}
    viewBox="0 0 8 8"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0 4C2.20914 4 4 2.20914 4 0C4 2.20914 5.79086 4 8 4C5.79086 4 4 5.79086 4 8C4 5.79086 2.20914 4 0 4Z"
      fill="currentColor"
    />
  </svg>
);

/**
 * Section Kicker with 3 diamond stars on each side (✦ ✦ ✦  LABEL  ✦ ✦ ✦)
 * Matches .title in sondaven.com/en
 */
export const SectionKicker: React.FC<{ label: string; className?: string }> = ({
  label,
  className = ''
}) => (
  <div className={`inline-flex items-center justify-center gap-4 ${className}`}>
    <div className="flex items-center gap-1.5 opacity-90">
      <DiamondStar className="w-2 h-2" />
      <DiamondStar className="w-2 h-2" />
      <DiamondStar className="w-2 h-2" />
    </div>
    <span className="font-sd-body text-[11px] tracking-[0.14em] uppercase">{label}</span>
    <div className="flex items-center gap-1.5 opacity-90">
      <DiamondStar className="w-2 h-2" />
      <DiamondStar className="w-2 h-2" />
      <DiamondStar className="w-2 h-2" />
    </div>
  </div>
);

/**
 * Circular Previous / Next Icon Button matching .btn-ico in sondaven.com/en
 */
export const CircleArrowButton: React.FC<{
  direction: 'prev' | 'next' | 'up-right';
  onClick?: () => void;
  ariaLabel: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ direction, onClick, ariaLabel, size = 'md', className = '' }) => {
  const dims =
    size === 'sm' ? 'w-9 h-9' : size === 'lg' ? 'w-12 h-12' : 'w-10 h-10';

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={`group relative inline-flex items-center justify-center rounded-full border border-current/30 hover:border-current transition-all duration-500 overflow-hidden cursor-pointer ${dims} ${className}`}
    >
      <span className="absolute inset-0 bg-current scale-0 group-hover:scale-100 rounded-full transition-transform duration-500 ease-out" />
      <svg
        className="relative z-10 w-4 h-4 transition-colors duration-500 group-hover:text-[var(--theme-bg,#2c2824)]"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {direction === 'prev' && (
          <path
            d="M10.5 3L5.5 8L10.5 13"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="square"
          />
        )}
        {direction === 'next' && (
          <path
            d="M5.5 3L10.5 8L5.5 13"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="square"
          />
        )}
        {direction === 'up-right' && (
          <path
            d="M4.5 11.5L11.5 4.5M11.5 4.5H5.5M11.5 4.5V10.5"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="square"
          />
        )}
      </svg>
    </button>
  );
};

/**
 * Son Daven's Iconic Carved Comb-Tooth Architectural Typography SVG
 * Renders "MY TRAVEL EXPERT" (or any text) with the signature Hutsul/Himalayan
 * vertical comb-tooth notches along the top and bottom edges of the letterforms.
 */
export const CarvedMonumentLogo: React.FC<{
  text?: string;
  variant?: 'hero' | 'header' | 'footer';
  className?: string;
}> = ({ text = 'MY TRAVEL EXPERT', variant = 'hero', className = '' }) => {
  const maskId = React.useId().replace(/:/g, '');

  if (variant === 'header') {
    return (
      <div className={`inline-flex flex-col items-center select-none ${className}`}>
        <svg
          viewBox="0 0 360 36"
          className="h-5 md:h-6 w-auto overflow-visible"
          fill="currentColor"
          aria-label={text}
        >
          <defs>
            <mask id={`hdr-comb-${maskId}`}>
              <rect x="0" y="0" width="360" height="36" fill="white" />
              {Array.from({ length: 72 }).map((_, i) => (
                <React.Fragment key={i}>
                  <rect x={i * 5 + 1.5} y="0" width="1.8" height={i % 2 === 0 ? '4.5' : '2.8'} fill="black" />
                  <rect
                    x={i * 5 + 1.5}
                    y={i % 2 === 0 ? '31.5' : '33.2'}
                    width="1.8"
                    height="5"
                    fill="black"
                  />
                </React.Fragment>
              ))}
            </mask>
          </defs>
          <g mask={`url(#hdr-comb-${maskId})`}>
            <text
              x="180"
              y="26"
              textAnchor="middle"
              fontFamily="'Syncopate', 'KTF Metro Blueline', sans-serif"
              fontWeight="700"
              fontSize="21"
              letterSpacing="0.14em"
              fill="currentColor"
            >
              {text}
            </text>
          </g>
        </svg>
      </div>
    );
  }

  // Hero / Footer Monumental Carved Comb-Tooth SVG
  const isFooter = variant === 'footer';
  const teethCount = 138;

  return (
    <div className={`w-full select-none ${className}`}>
      <svg
        viewBox="0 0 1100 132"
        className="w-full h-auto overflow-visible"
        fill="currentColor"
        role="img"
        aria-label={text}
      >
        <defs>
          <mask id={`hero-comb-${maskId}`}>
            <rect x="0" y="0" width="1100" height="132" fill="white" />
            {Array.from({ length: teethCount }).map((_, i) => {
              const topDepth = i % 3 === 0 ? 22 : i % 2 === 0 ? 15 : 9;
              const botDepth = i % 3 === 1 ? 22 : i % 2 === 0 ? 15 : 9;
              return (
                <React.Fragment key={i}>
                  <rect x={i * 8 + 2} y="0" width="3.4" height={topDepth + 12} fill="black" />
                  <rect
                    x={i * 8 + 2}
                    y={122 - botDepth}
                    width="3.4"
                    height={botDepth + 14}
                    fill="black"
                  />
                </React.Fragment>
              );
            })}
          </mask>
        </defs>
        <g mask={`url(#hero-comb-${maskId})`}>
          <text
            x="0"
            y="112"
            fontFamily="'KTF Metro Roman', 'Cormorant Garamond', Georgia, serif"
            fontWeight="700"
            fontSize="126"
            letterSpacing="0.02em"
            fill="currentColor"
            textLength="1090"
            lengthAdjust="spacingAndGlyphs"
          >
            {text}
          </text>
        </g>
      </svg>
    </div>
  );
};

/**
 * Stepped Pixel Mosaic Section Transition Divider from sondaven.com/en
 */
export const SteppedTransition: React.FC<{
  fromTheme: 'dark' | 'light';
  toTheme: 'dark' | 'light';
  seed?: number;
}> = ({ fromTheme, toTheme, seed = 1 }) => {
  const bgClass = fromTheme === 'dark' ? 'bg-[#2c2824]' : 'bg-[#a89474]';
  const fillHex = toTheme === 'dark' ? '#2c2824' : '#a89474';

  // Deterministic stepped architectural pixel blocks matching Son Daven's transition SVGs
  const cols = 24;
  return (
    <div className={`w-full overflow-hidden leading-none select-none ${bgClass}`} aria-hidden="true">
      <svg
        viewBox="0 0 1440 48"
        preserveAspectRatio="none"
        className="w-full h-7 md:h-11 block"
        fill="none"
      >
        {Array.from({ length: cols }).map((_, idx) => {
          const h = ((idx * 17 + seed * 11) % 3) * 14 + 12;
          const hasFloatingPixel = (idx + seed) % 4 === 0;
          return (
            <React.Fragment key={idx}>
              <rect
                x={idx * (1440 / cols)}
                y={48 - h}
                width={1440 / cols + 1}
                height={h}
                fill={fillHex}
              />
              {hasFloatingPixel && (
                <rect
                  x={idx * (1440 / cols) + 12}
                  y={Math.max(2, 48 - h - 14)}
                  width={1440 / (cols * 2)}
                  height="8"
                  fill={fillHex}
                />
              )}
            </React.Fragment>
          );
        })}
      </svg>
    </div>
  );
};

/**
 * Zero-Broken-Image Policy Resilient Image with Fallback
 */
export const ResilientImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
}> = ({ src, alt, className = '', fallbackLabel }) => {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#2c2824] via-[#3a332c] to-[#a89474]/40 text-[#a89474] p-6 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <DiamondStar className="w-6 h-6 mb-3 opacity-80" />
        <span className="font-sd-display text-xl tracking-tight">
          {fallbackLabel || alt}
        </span>
        <span className="font-sd-body text-[10px] tracking-[0.15em] opacity-60 mt-1">
          MY TRAVEL EXPERT · HIMALAYAS
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
};
