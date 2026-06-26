/**
 * Logo Component
 * 
 * Centralized logo component used across the application.
 * Replace the logo.png file in src/assets/ with your custom logo.
 */

import logoImage from '@/assets/logo.png';

interface LogoProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

const sizeClasses = {
    sm: 'h-8 w-36',
    md: 'h-10 w-40',
    lg: 'h-16 w-64',
    xl: 'h-24 w-96'
};

export function Logo({ size = 'md', className = '' }: LogoProps) {
    return (
        <img
            src={logoImage}
            alt="Nagarkot Forwarders"
            className={`${sizeClasses[size]} object-contain ${className}`}
        />
    );
}

export const COMPANY_NAME = 'Nagarkot Forwarders';
export const APP_NAME = 'Tool Repository';
export const FULL_APP_NAME = 'Nagarkot Tool Repository';

export default Logo;
