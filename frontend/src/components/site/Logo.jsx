export default function Logo({ className = "w-10 h-10" }) {
  return (
    <svg
      viewBox="0 0 220 220"
      className={className}
      aria-label="ID9_AGENCY logo"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* "i" letter — pink square dot + purple stem */}
      <rect x="48" y="48" width="34" height="34" rx="3" fill="#E91E63" />
      <rect x="48" y="92" width="34" height="100" rx="3" fill="#3F2752" />

      {/* "D" half-circle in purple */}
      <path
        d="M100 48 L100 192 L120 192 A72 72 0 0 0 192 120 L192 120 A72 72 0 0 0 120 48 Z"
        fill="#3F2752"
      />

      {/* "9" head: white ring + pink filled center */}
      <circle cx="152" cy="108" r="26" fill="#F8F8F8" />
      <circle cx="152" cy="108" r="16" fill="#E91E63" />

      {/* "9" tail: white stroke curving down-left */}
      <path
        d="M144 130 L122 188"
        stroke="#F8F8F8"
        strokeWidth="9"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
