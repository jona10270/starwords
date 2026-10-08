import type { SVGProps } from "react";

export type IconProps = SVGProps<SVGSVGElement>;

// Base comun de los iconos de linea del diseño
const LineIcon = ({ children, ...props }: IconProps) => (
    <svg
        width="17"
        height="17"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
        {...props}
    >
        {children}
    </svg>
);

export const PeopleIcon = (props: IconProps) => (
    <LineIcon {...props}>
        <circle cx="12" cy="8" r="3.6" />
        <path d="M4.5 20c1.2-3.6 4-5.4 7.5-5.4s6.3 1.8 7.5 5.4" />
    </LineIcon>
);

export const FilmsIcon = (props: IconProps) => (
    <LineIcon {...props}>
        <rect x="3" y="4" width="18" height="16" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="3" y1="15" x2="21" y2="15" />
        <line x1="8" y1="4" x2="8" y2="20" />
        <line x1="16" y1="4" x2="16" y2="20" />
    </LineIcon>
);

export const StarshipsIcon = (props: IconProps) => (
    <LineIcon {...props}>
        <path d="M12 3l4 12H8z" />
        <path d="M8 15l-4 4h16l-4-4" />
        <line x1="12" y1="15" x2="12" y2="21" />
    </LineIcon>
);

export const VehiclesIcon = (props: IconProps) => (
    <LineIcon {...props}>
        <path d="M3 14h18l-2-5H5z" />
        <circle cx="7.5" cy="17.5" r="2" />
        <circle cx="16.5" cy="17.5" r="2" />
    </LineIcon>
);

export const SpeciesIcon = (props: IconProps) => (
    <LineIcon {...props}>
        <circle cx="9" cy="9" r="4" />
        <circle cx="16" cy="15" r="4.5" />
    </LineIcon>
);

export const PlanetsIcon = (props: IconProps) => (
    <LineIcon {...props}>
        <circle cx="12" cy="12" r="7" />
        <ellipse cx="12" cy="12" rx="10.5" ry="3.2" />
    </LineIcon>
);

export const UserIcon = (props: IconProps) => (
    <LineIcon width="15" height="15" strokeWidth={2} {...props}>
        <circle cx="12" cy="8" r="3.6" />
        <path d="M4.5 20c1.2-3.6 4-5.4 7.5-5.4s6.3 1.8 7.5 5.4" />
    </LineIcon>
);

export const MenuIcon = (props: IconProps) => (
    <LineIcon width="16" height="16" strokeWidth={2} {...props}>
        <line x1="3" y1="7" x2="21" y2="7" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="17" x2="21" y2="17" />
    </LineIcon>
);
