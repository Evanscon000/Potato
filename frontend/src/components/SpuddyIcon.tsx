// src/components/SpuddyIcon.tsx

export default function SpuddyIcon(props: { size?: number }) {
    const s = props.size ?? 36;
    return (
        <svg
            width={s}
            height={s}
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* body */}
            <ellipse cx="32" cy="32" rx="28" ry="32" fill="#C59D5F" />
            {/* eyes */}
            <circle cx="22" cy="24" r="4" fill="#000" />
            <circle cx="42" cy="24" r="4" fill="#000" />
            {/* smile */}
            <path
                d="M20 42 Q32 52 44 42"
                stroke="#000"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
            />
            {/* left leg */}
            <line
                x1="22"
                y1="60"
                x2="22"
                y2="68"
                stroke="#8D6E63"
                strokeWidth="4"
                strokeLinecap="round"
            />
            {/* right leg */}
            <line
                x1="42"
                y1="60"
                x2="42"
                y2="68"
                stroke="#8D6E63"
                strokeWidth="4"
                strokeLinecap="round"
            />
        </svg>
    );
}
