'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Package, Eye, EyeOff } from 'lucide-react';
import { authService } from '@/services/auth-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [showPw, setShowPw] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await authService.login({ email, password });
            router.push('/dashboard');
        } catch (err: unknown) {
            const axiosErr = err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } };
            const apiMessage = axiosErr?.response?.data?.errors
                ? Object.values(axiosErr.response.data.errors).flat().join(' ')
                : axiosErr?.response?.data?.message;
            const message = apiMessage || 'Login failed. Please check your credentials.';
            setError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-950 via-slate-800 to-slate-950 p-4">
            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-600/30">
                        <Package className="h-9 w-9 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white">Inventory Manager</h1>
                    <p className="mt-1 text-slate-400">Sign in to your account</p>
                </div>

                <div className="rounded-2xl bg-white p-8 shadow-2xl">
                    <form onSubmit={onSubmit} className="space-y-5">
                        {error && (
                            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                                {error}
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <Label htmlFor="email">Email address</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoComplete="email"
                                placeholder="admin@company.com"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPw ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    className="pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPw((v) => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <Button type="submit" size="lg" loading={loading} className="w-full">
                            Sign In
                        </Button>
                    </form>
                </div>

                <p className="mt-6 text-center text-xs text-slate-500">
                    Access is restricted to authorised personnel only.
                </p>
            </div>
        </div>
    );
}
