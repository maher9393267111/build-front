'use client';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { setRole, setToken, setVerified } from "@features/auth/authSlice";
import { useSelector, useDispatch } from "react-redux";
import { setProfile } from "@features/profile/profileSlice";
import { login } from "@services/api";
import { createCookies } from "@hooks/cookies";
import { FcGoogle } from "react-icons/fc";
import { useForm } from "react-hook-form";

const SignInPage = () => {
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const dispatch = useDispatch();
    const token = useSelector((state) => state.auth.token);
    const profile = useSelector((state) => state.profile.profile);

    // Initialize react-hook-form
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            email: "",
            password: ""
        },
        mode: 'onChange'
    });

    useEffect(() => {
        if (token && profile) {
            router.replace("/");
        }
    }, [token, profile, router]);

    const onSubmit = async (data) => {
        setError("");
        setIsLoading(true);
        
        try {
            const res = await login({ email: data.email, password: data.password });

            // Save token in cookies
            createCookies("token", res.token);

            // Redux: set token, role, and profile
            dispatch(setToken(res.token));
            dispatch(setRole(res.user.role));
            dispatch(setProfile(res.user));
            dispatch(setVerified(res.user.verified));

            router.push("/");
        } catch (err) {
            setError(
                err?.response?.data?.error ||
                err?.message ||
                "Login failed. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        console.log("Đăng nhập bằng Google");
    };

    return (
        <div className="min-h-screen bg-gray-50">
       

            <div className="flex flex-col justify-center py-10 px-4">
                <div className="sm:mx-auto sm:w-full sm:max-w-lg text-center">
                    <h2 className="text-3xl font-bold text-primary-700">
                        Sign In
                    </h2>
                    <p className="mt-3 text-center text-gray-600">
                        Access your account and connect with customers
                    </p>
                </div>
                
                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-6 shadow-lg rounded-xl border border-gray-100">
                        {error && (
                            <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg">
                                {error}
                            </div>
                        )}
                        
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            <div className="group">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Address*
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    {...register("email", {
                                        required: "Email address is required",
                                        pattern: {
                                            value: /^\S+@\S+$/i,
                                            message: "Invalid email format"
                                        }
                                    })}
                                    className={`input bg-white w-full rounded-lg border ${
                                        errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-primary-500 focus:ring-primary-200'
                                    } focus:ring-2 py-3 px-4 transition-all outline-none`}
                                    placeholder="Your email"
                                    aria-invalid={errors.email ? "true" : "false"}
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-xs mt-1" role="alert">{errors.email.message}</p>
                                )}
                            </div>
                            
                            <div className="group">
                                <div className="flex items-center justify-between mb-1">
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                        Password*
                                    </label>
                                    <div className="text-sm">
                                        <Link href="/forgot-password" className="font-medium text-primary-600 hover:text-primary-700 hover:underline">
                                            Forgot password?
                                        </Link>
                                    </div>
                                </div>
                                <input
                                    id="password"
                                    type="password"
                                    {...register("password", {
                                        required: "Password is required",
                                        minLength: {
                                            value: 6,
                                            message: "Password must be at least 6 characters"
                                        }
                                    })}
                                    className={`input bg-white w-full rounded-lg border ${
                                        errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-primary-500 focus:ring-primary-200'
                                    } focus:ring-2 py-3 px-4 transition-all outline-none`}
                                    placeholder="Your password"
                                    aria-invalid={errors.password ? "true" : "false"}
                                />
                                {errors.password && (
                                    <p className="text-red-500 text-xs mt-1" role="alert">{errors.password.message}</p>
                                )}
                            </div>
                            
                            <div className="mt-6">
                                <button
                                    type="submit"
                                    className="w-full py-3 px-4 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-all shadow-md hover:shadow-lg"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Signing in...' : 'Sign In'}
                                </button>
                            </div>
                        </form>
                        
                        <div className="mt-8 relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">
                                    Or continue with
                                </span>
                            </div>
                        </div>
                        
                        <div className="mt-6">
                            <button
                                type="button"
                                onClick={handleGoogleLogin}
                                className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
                            >
                                <FcGoogle className="h-5 w-5 mr-2" />
                                Sign in with Google
                            </button>
                        </div>
                        
                        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                            <p className="text-gray-600">
                                Don't have an account?{" "}
                                <Link href="/signup" className="font-medium text-primary-600 hover:text-primary-700 hover:underline">
                                    Sign Up
                                </Link>
                            </p>
                            <p className="mt-2 text-sm text-gray-500">
                                <Link href="/service-provider/signup" className="font-medium text-primary-600 hover:text-primary-700 hover:underline">
                                    Register as a Service Provider
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignInPage;
