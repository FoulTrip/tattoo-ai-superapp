"use client"

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Mail, Lock, User, Eye, EyeOff, Users, AlertCircle } from 'lucide-react';
import { RegisterData } from '@/types/auth';
import { signIn } from 'next-auth/react';
import axios from 'axios';

export default function AuthComponent() {
    const searchParams = useSearchParams();
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState<RegisterData>({
        email: '',
        password: '',
        name: '',
        phone: '',
        avatar: '',
        userType: 'CLIENTE'
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const errorParam = searchParams.get('error');
        if (errorParam) {
            if (errorParam === 'CredentialsSignin') {
                setError('Invalid credentials');
            } else {
                setError('An error occurred during sign in');
            }
        }
    }, [searchParams]);

    const handlerOnChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setError('');
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const SendLogin = async () => {
        setIsLoading(true);
        setError('');

        console.log(formData.email)
        console.log(formData.password)

        try {
            const result = await signIn("credentials", {
                email: formData.email,
                password: formData.password,
                redirect: false
            });

            if (result?.error) {
                setError('Invalid credentials');
            } else if (result?.ok) {
                window.location.href = '/overview';
            }
        } catch (error) {
            console.error("Login error:", error);
            setError("An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    }

    const SendRegister = async () => {
        setIsLoading(true);
        setError('');

        try {
            const response = await axios.post("/api/auth/register", {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
                userType: formData.userType,
            });

            const data = response.data;
            console.log("Registration successful:", data);

            // Esperar un momento antes de hacer login
            await new Promise(resolve => setTimeout(resolve, 500));

            // Intentar login automático
            const loginResult = await signIn("credentials", {
                email: data.email,
                password: formData.password,
                redirect: false,
                callbackUrl: "/",
            });

            if (loginResult?.error) {
                console.error("Auto-login failed:", loginResult.error);
                // Si falla el auto-login, cambiar a modo login
                setError("Registration successful! Please log in.");
                setIsLogin(true);
            } else if (loginResult?.ok) {
                window.location.href = "/overview";
            }
        } catch (error) {
            console.error("Register error:", error);
            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.error || error.response?.data?.message || "Registration failed";
                setError(errorMessage);
            } else {
                setError("An unexpected error occurred");
            }
        } finally {
            setIsLoading(false);
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isLogin) {
            SendLogin();
        } else {
            SendRegister();
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-sm">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-semibold text-gray-900 mb-1">
                        {isLogin ? 'Welcome back' : 'Create account'}
                    </h1>
                    <p className="text-sm text-gray-500">
                        {isLogin ? 'Enter your credentials to continue' : 'Sign up to get started'}
                    </p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-red-800">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1.5">
                                Nombre Completo
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-base focus:outline-none focus:border-gray-400 transition-colors"
                                    placeholder="John Doe"
                                    name="name"
                                    value={formData.name}
                                    onChange={handlerOnChange}
                                    required={!isLogin}
                                />
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1.5">
                            Correo Electronico
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="email"
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-base focus:outline-none focus:border-gray-400 transition-colors"
                                placeholder="name@company.com"
                                name="email"
                                value={formData.email}
                                onChange={handlerOnChange}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1.5">
                            Contraseña
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg text-base focus:outline-none focus:border-gray-400 transition-colors"
                                placeholder="••••••••"
                                name="password"
                                value={formData.password}
                                onChange={handlerOnChange}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {!isLogin && (
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1.5">
                                Confirmar contraseña
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg text-base focus:outline-none focus:border-gray-400 transition-colors"
                                    placeholder="••••••••"
                                    name="repassword"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    )}

                    {!isLogin && (
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1.5">
                                Tipo de Usuario
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, userType: 'CLIENTE' })}
                                    className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border-2 transition-all ${
                                        formData.userType === 'CLIENTE'
                                            ? 'border-gray-900 bg-gray-50'
                                            : 'border-gray-200 bg-white hover:border-gray-300'
                                    }`}
                                >
                                    <User className={`w-4 h-4 ${formData.userType === 'CLIENTE' ? 'text-gray-900' : 'text-gray-400'}`} />
                                    <span className={`text-sm font-medium ${formData.userType === 'CLIENTE' ? 'text-gray-900' : 'text-gray-600'}`}>
                                        Normal
                                    </span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, userType: 'TATUADOR' })}
                                    className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border-2 transition-all ${
                                        formData.userType === 'TATUADOR'
                                            ? 'border-gray-900 bg-gray-50'
                                            : 'border-gray-200 bg-white hover:border-gray-300'
                                    }`}
                                >
                                    <Users className={`w-4 h-4 ${formData.userType === 'TATUADOR' ? 'text-gray-900' : 'text-gray-400'}`} />
                                    <span className={`text-sm font-medium ${formData.userType === 'TATUADOR' ? 'text-gray-900' : 'text-gray-600'}`}>
                                        Tatuador
                                    </span>
                                </button>
                            </div>
                        </div>
                    )}

                    {isLogin && (
                        <div className="flex items-center justify-end">
                            <button
                                type="button"
                                className="text-xs text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                Forgot password?
                            </button>
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={isLogin ? SendLogin : SendRegister}
                        disabled={isLoading}
                        className="w-full bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium py-2.5 rounded-lg transition-colors mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Loading...' : (isLogin ? 'Sign in' : 'Create account')}
                    </button>

                    <div className="text-center pt-2">
                        <span className="text-xs text-gray-600">
                            {isLogin ? "Don't have an account? " : 'Already have an account? '}
                        </span>
                        <button
                            type="button"
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setError('');
                            }}
                            className="text-xs text-gray-900 font-medium hover:underline"
                        >
                            {isLogin ? 'Sign up' : 'Sign in'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}