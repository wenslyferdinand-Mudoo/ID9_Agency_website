export default function Logo({ className = "w-10 h-10" }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-label="ID9 logo">
      {/* i column with orange dot */}
      <rect x="38" y="62" width="28" height="108" rx="6" fill="#3F2752" />
      <rect x="38" y="28" width="28" height="28" rx="4" fill="#FFA500" />
      {/* D shape */}
      <path
        d="M86 28 A86 86 0 0 1 86 200 Z"
        fill="#3F2752"
      />
      {/* 9 cutout */}
      <circle cx="128" cy="92" r="22" fill="#F8F8F8" />
      <circle cx="128" cy="92" r="14" fill="#FFA500" />
      <path
        d="M120 105 L100 170"
        stroke="#F8F8F8"
        strokeWidth="8"
        strokeLinecap="round"
      />
    </svg>
  );
}
