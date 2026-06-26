/**
 * Profile Form Fields
 * 
 * Reusable form field components for profile editing.
 */
import { Lock, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// ============================================================================
// Types
// ============================================================================
interface BaseFieldProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

// ============================================================================
// Username Field
// ============================================================================
interface UsernameFieldProps extends BaseFieldProps {
    editable?: boolean;
}

export function UsernameField({ value, onChange, editable = false, disabled }: UsernameFieldProps) {
    return (
        <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
                id="username"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={!editable || disabled}
                className={cn(!editable && 'bg-[hsl(var(--muted))]')}
            />
            {!editable && (
                <p className="text-xs text-[hsl(var(--muted-foreground))]">
                    Username cannot be changed
                </p>
            )}
        </div>
    );
}

// ============================================================================
// Name Field
// ============================================================================
export function NameField({ value, onChange, disabled }: BaseFieldProps) {
    return (
        <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
                id="name"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                required
                disabled={disabled}
            />
        </div>
    );
}

// ============================================================================
// Email Field
// ============================================================================
export function EmailField({ value, onChange, disabled }: BaseFieldProps) {
    return (
        <div className="space-y-2 md:col-span-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                <Input
                    id="email"
                    type="email"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="pl-10"
                    required
                    disabled={disabled}
                />
            </div>
        </div>
    );
}

// ============================================================================
// Password Fields
// ============================================================================
interface PasswordFieldsProps {
    password: string;
    confirmPassword: string;
    onPasswordChange: (value: string) => void;
    onConfirmChange: (value: string) => void;
    showConfirm?: boolean;
    disabled?: boolean;
}

export function PasswordFields({
    password,
    confirmPassword,
    onPasswordChange,
    onConfirmChange,
    showConfirm = true,
    disabled,
}: PasswordFieldsProps) {
    return (
        <>
            <div className={cn('space-y-2', !showConfirm && 'md:col-span-2')}>
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                    <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => onPasswordChange(e.target.value)}
                        placeholder="Leave blank to keep current password"
                        className="pl-10"
                        disabled={disabled}
                    />
                </div>
                {!showConfirm && (
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">
                        Only fill this if you want to change your password
                    </p>
                )}
            </div>

            {showConfirm && (
                <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                        <Input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => onConfirmChange(e.target.value)}
                            placeholder="Confirm new password"
                            className="pl-10"
                            disabled={disabled}
                        />
                    </div>
                </div>
            )}
        </>
    );
}
