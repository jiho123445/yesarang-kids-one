import React from 'react';

// Cute smiling sun mascot with blush
export function MascotSun({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Sun rays */}
      <circle cx="50" cy="50" r="42" fill="#FEF08A" fillOpacity="0.4" />
      <g stroke="#F59E0B" strokeWidth="4" strokeLinecap="round">
        <line x1="50" y1="6" x2="50" y2="14" />
        <line x1="50" y1="86" x2="50" y2="94" />
        <line x1="6" y1="50" x2="14" y2="50" />
        <line x1="86" y1="50" x2="94" y2="50" />
        <line x1="19" y1="19" x2="25" y2="25" />
        <line x1="75" y1="75" x2="81" y2="81" />
        <line x1="19" y1="81" x2="25" y2="75" />
        <line x1="75" y1="25" x2="81" y2="19" />
      </g>
      {/* Sun Body */}
      <circle cx="50" cy="50" r="32" fill="#FBBF24" />
      <circle cx="50" cy="50" r="30" fill="#FCD34D" />
      {/* Cheerful Eyes */}
      <ellipse cx="40" cy="46" rx="3.5" ry="4.5" fill="#78350F" />
      <circle cx="41.5" cy="44.5" r="1.5" fill="#FFFFFF" />
      <ellipse cx="60" cy="46" rx="3.5" ry="4.5" fill="#78350F" />
      <circle cx="61.5" cy="44.5" r="1.5" fill="#FFFFFF" />
      {/* Blush */}
      <ellipse cx="33" cy="53" rx="4.5" ry="2.5" fill="#F87171" fillOpacity="0.7" />
      <ellipse cx="67" cy="53" rx="4.5" ry="2.5" fill="#F87171" fillOpacity="0.7" />
      {/* Smile */}
      <path d="M42 54C44.5 59 55.5 59 58 54" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

// Cute little bear mascot with heart
export function MascotBear({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Ears */}
      <circle cx="28" cy="28" r="14" fill="#D97706" />
      <circle cx="28" cy="28" r="8" fill="#FDE68A" />
      <circle cx="72" cy="28" r="14" fill="#D97706" />
      <circle cx="72" cy="28" r="8" fill="#FDE68A" />
      {/* Head */}
      <circle cx="50" cy="52" r="34" fill="#F59E0B" />
      {/* Snout */}
      <ellipse cx="50" cy="59" rx="15" ry="11" fill="#FEF3C7" />
      <ellipse cx="50" cy="54" rx="5" ry="3.5" fill="#78350F" />
      <path d="M50 58V63M46 63C48 65 52 65 54 63" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />
      {/* Eyes */}
      <circle cx="38" cy="46" r="3.5" fill="#78350F" />
      <circle cx="39" cy="45" r="1.2" fill="#FFFFFF" />
      <circle cx="62" cy="46" r="3.5" fill="#78350F" />
      <circle cx="63" cy="45" r="1.2" fill="#FFFFFF" />
      {/* Cheeks */}
      <circle cx="31" cy="55" r="4" fill="#FB7185" fillOpacity="0.6" />
      <circle cx="69" cy="55" r="4" fill="#FB7185" fillOpacity="0.6" />
      {/* Mini heart on forehead */}
      <path d="M50 34C48 31 44 32 44 35C44 38 50 41 50 41C50 41 56 38 56 35C56 32 52 31 50 34Z" fill="#F43F5E" />
    </svg>
  );
}

// Cute little sprout
export function MascotSprout({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="36" fill="#ECFDF5" />
      {/* Stem */}
      <path d="M40 60C40 48 40 40 40 32" stroke="#059669" strokeWidth="4" strokeLinecap="round" />
      {/* Left Leaf */}
      <path d="M38 42C24 40 22 26 36 28C40 32 39 38 38 42Z" fill="#34D399" stroke="#059669" strokeWidth="2" />
      {/* Right Leaf */}
      <path d="M42 36C56 34 58 20 44 22C40 26 41 32 42 36Z" fill="#10B981" stroke="#047857" strokeWidth="2" />
      {/* Smiley face in circle */}
      <circle cx="33" cy="50" r="2" fill="#065F46" />
      <circle cx="47" cy="50" r="2" fill="#065F46" />
      <path d="M37 54C38.5 56 41.5 56 43 54" stroke="#065F46" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// Cute Book Illustration
export function IconCuteBook({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="14" y="20" width="52" height="42" rx="6" fill="#FDE047" />
      <path d="M40 20V62" stroke="#CA8A04" strokeWidth="3" strokeDasharray="3 3" />
      <path d="M22 30H34" stroke="#854D0E" strokeWidth="3" strokeLinecap="round" />
      <path d="M22 38H32" stroke="#854D0E" strokeWidth="3" strokeLinecap="round" />
      <path d="M22 46H34" stroke="#854D0E" strokeWidth="3" strokeLinecap="round" />
      <circle cx="52" cy="38" r="8" fill="#F43F5E" />
      <path d="M52 35C50 32 47 33 47 36C47 39 52 42 52 42C52 42 57 39 57 36C57 33 54 32 52 35Z" fill="#FFFFFF" />
    </svg>
  );
}

// Cute Clock Illustration
export function IconCuteClock({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Clock ears */}
      <circle cx="22" cy="22" r="8" fill="#F97316" />
      <circle cx="58" cy="22" r="8" fill="#F97316" />
      {/* Clock body */}
      <circle cx="40" cy="44" r="28" fill="#FFEDD5" stroke="#EA580C" strokeWidth="4" />
      <circle cx="40" cy="44" r="22" fill="#FFFFFF" />
      {/* Hands */}
      <line x1="40" y1="44" x2="40" y2="31" stroke="#C2410C" strokeWidth="3" strokeLinecap="round" />
      <line x1="40" y1="44" x2="51" y2="44" stroke="#C2410C" strokeWidth="3" strokeLinecap="round" />
      <circle cx="40" cy="44" r="3" fill="#9A3412" />
      {/* Legs */}
      <line x1="26" y1="68" x2="20" y2="74" stroke="#EA580C" strokeWidth="4" strokeLinecap="round" />
      <line x1="54" y1="68" x2="60" y2="74" stroke="#EA580C" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

// Cute Meal / Food Bowl
export function IconCuteMeal({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Steam */}
      <path d="M30 18C30 14 34 14 34 10" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M40 16C40 12 44 12 44 8" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M50 18C50 14 54 14 54 10" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" />
      {/* Bowl */}
      <path d="M16 34C16 54 26 62 40 62C54 62 64 54 64 34H16Z" fill="#F87171" stroke="#DC2626" strokeWidth="3" />
      <ellipse cx="40" cy="34" rx="24" ry="7" fill="#FEF08A" stroke="#DC2626" strokeWidth="3" />
      {/* Peas / veggies */}
      <circle cx="34" cy="34" r="2.5" fill="#10B981" />
      <circle cx="44" cy="33" r="2.5" fill="#F97316" />
      <circle cx="48" cy="36" r="2.5" fill="#10B981" />
      {/* Base */}
      <rect x="32" y="62" width="16" height="6" rx="2" fill="#DC2626" />
    </svg>
  );
}

// Cute Child Mascot / Student
export function MascotChild({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Cute yellow hat / beret */}
      <ellipse cx="50" cy="28" rx="26" ry="12" fill="#FBBF24" />
      <circle cx="50" cy="16" r="4" fill="#F59E0B" />
      {/* Hair */}
      <circle cx="50" cy="48" r="28" fill="#451A03" />
      {/* Face */}
      <circle cx="50" cy="54" r="24" fill="#FED7AA" />
      <path d="M30 46C34 50 42 48 50 48C58 48 66 50 70 46" fill="#451A03" />
      {/* Eyes */}
      <ellipse cx="42" cy="54" rx="2.5" ry="3.5" fill="#1C1917" />
      <ellipse cx="58" cy="54" rx="2.5" ry="3.5" fill="#1C1917" />
      {/* Rosy cheeks */}
      <circle cx="35" cy="59" r="3.5" fill="#FB7185" fillOpacity="0.7" />
      <circle cx="65" cy="59" r="3.5" fill="#FB7185" fillOpacity="0.7" />
      {/* Smile */}
      <path d="M45 61C47 64 53 64 55 61" stroke="#1C1917" strokeWidth="2.5" strokeLinecap="round" />
      {/* Cute collar */}
      <path d="M38 76L46 84L50 80L54 84L62 76" fill="#FFFFFF" stroke="#F43F5E" strokeWidth="2" />
    </svg>
  );
}
