import { RegisterData } from "@/types/auth";
import axios from "axios";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

function UseLogin() {
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
    
    return {
        isLogin,
        error,
        formData,
        showPassword,
        showConfirmPassword,
        isLoading,
        setFormData,
        setIsLogin,
        setError,
        SendLogin,
        SendRegister,
        setShowConfirmPassword,
        setShowPassword,
        handleSubmit,
        handlerOnChange,
    }
}

export default UseLogin