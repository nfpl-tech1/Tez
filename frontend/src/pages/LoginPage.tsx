import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertMessage } from '@/components/ui/alert';
import { Loader2, User, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { FULL_APP_NAME } from '@/components/ui/Logo';
import loginLogo from '@/assets/logo-login.png';

export default function LoginPage() {
    const [usernameOrEmail, setUsernameOrEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(usernameOrEmail, password);
        } catch (err: any) {
            setError(err.response?.data?.detail || err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex">
            {/* Left Side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12 text-white relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2" />
                </div>

                <div className="relative z-10 max-w-md text-center">
                    <div className="bg-white rounded-3xl p-4 mx-auto mb-8 shadow-2xl inline-block">
                        <img src={loginLogo} alt="Nagarkot" className="h-28 w-auto" />
                    </div>
                    <h1 className="text-4xl font-bold mb-4">{FULL_APP_NAME}</h1>
                    <p className="text-xl text-blue-100 mb-8">
                        Your team's central hub for discovering, sharing, and managing productivity tools
                    </p>
                    <div className="flex items-center justify-center gap-2 text-sm text-blue-200">
                        <Sparkles className="h-4 w-4" />
                        <span>Streamline your workflow</span>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex-1 flex items-center justify-center p-8 bg-[hsl(var(--background))]">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex flex-col items-center mb-8">
                        <img src={loginLogo} alt="Nagarkot" className="h-16 w-auto mb-4" />
                        <h1 className="text-2xl font-bold">{FULL_APP_NAME}</h1>
                    </div>

                    <Card className="shadow-2xl border-0">
                        <CardHeader className="space-y-1 pb-4">
                            <CardTitle className="text-2xl">Welcome back</CardTitle>
                            <CardDescription className="text-base">
                                Sign in to access your dashboard
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {error && (
                                    <AlertMessage
                                        variant="destructive"
                                        message={error}
                                        onDismiss={() => setError('')}
                                    />
                                )}

                                <div className="space-y-2">
                                    <Label htmlFor="usernameOrEmail">Username or Email</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[hsl(var(--muted-foreground))]" />
                                        <Input
                                            id="usernameOrEmail"
                                            type="text"
                                            placeholder="Enter username or email"
                                            value={usernameOrEmail}
                                            onChange={(e) => setUsernameOrEmail(e.target.value)}
                                            required
                                            autoFocus
                                            className="pl-10 h-12"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[hsl(var(--muted-foreground))]" />
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="Enter password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="pl-10 h-12"
                                        />
                                    </div>
                                </div>

                                <Button type="submit" className="w-full h-12 text-base font-semibold" disabled={loading}>
                                    {loading ? (
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    ) : (
                                        <ArrowRight className="mr-2 h-5 w-5" />
                                    )}
                                    Sign in
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <p className="text-center text-sm text-[hsl(var(--muted-foreground))] mt-8">
                        Just want to browse?{' '}
                        <a href="/" className="text-[hsl(var(--primary))] hover:underline font-medium">
                            View public tools →
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
