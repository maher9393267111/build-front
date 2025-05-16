'use client';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { register } from "@services/api"; // Adjust path if needed
import { createCookies } from "@hooks/cookies";
import { useSelector } from "react-redux";
import { FcGoogle } from "react-icons/fc";

const page = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isEmployer, setIsEmployer] = useState(false); // State quản lý checkbox
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const router = useRouter();
    const token = useSelector((state) => state.auth.token);
    const profile = useSelector((state) => state.profile.profile);

    useEffect(() => {
        if (token && profile) {
            router.replace("/");
        }
    }, [token, profile, router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            // Prepare payload
            const payload = {
                email,
                password,
                name: email.split('@')[0], // Or ask for name in the form
                phone: '', // Add phone if you have a field
                role: isEmployer ? 'SERVICE_PROVIDER' : 'CUSTOMER'
            };

            const res = await register(payload);

            // Save token in cookies
            await createCookies('token', res.token);

            setSuccess('Registration successful!');
            setTimeout(() => {
                router.push('/signin');
            }, 1000);
        } catch (err) {
            setError(
                err?.response?.data?.error ||
                err?.message ||
                'Registration failed. Please try again.'
            );
        }
    };

    // Hàm xử lý đăng nhập bằng Google
    const handleGoogleLogin = () => {
        console.log("Đăng nhập bằng Google");
        // Bạn có thể tích hợp logic đăng nhập bằng Google tại đây
    };

    return (
        <>
            {/* <div className="flex min-h-full flex-col justify-center bg-gray-50">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm text-center">
                    <Link href="/" className="py-1 inline-block">
                        <Image
                            width={134}
                            height={29}
                            sizes="50vw"
                            src="/images/logo.png"
                            alt="Logo"
                        />
                    </Link>
                    <h4 className="mt-5 mb-8 text-center font-medium text-gray-500">
                        Create your account
                    </h4>
                </div>
                <div className="shadow bg-white sm:mx-auto sm:w-full sm:max-w-sm px-6 py-6 lg:px-8 rounded-xl">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && <p className="text-red-500">{error}</p>}
                        {success && <p className="text-green-500">{success}</p>}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                Email address
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    className="input bg-primary-100 w-full rounded-full"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)} // Cập nhật state email
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                Password
                            </label>
                            <div className="mt-2">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    className="input bg-primary-100 w-full rounded-full"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)} // Cập nhật state password
                                />
                            </div>
                        </div>
                        <div>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    className="mr-2"
                                    checked={isEmployer}
                                    onChange={(e) => setIsEmployer(e.target.checked)} // Cập nhật state checkbox
                                />
                                Register as an employer
                            </label>
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-full bg-primary-600 px-3 py-2 font-semibold leading-6 text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                            >
                                Sign Up
                            </button>
                        </div>
                    </form>

                
                    <div className="mt-6">
                        <button
                            onClick={handleGoogleLogin}
                            className="flex w-full justify-center rounded-full bg-white px-3 py-2 font-semibold leading-6 text-gray-700 shadow-sm border border-gray-300 hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-300"
                        >
                            <FcGoogle className="mr-2" size={20} />
                            Sign in with Google
                        </button>
                    </div>

                    <p className="mt-10 text-center text-sm text-gray-500">
                        Already a member?
                        <Link href="/signin" className="font-semibold leading-6 text-primary-600 hover:text-primary-500 m-1">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div> */}
        </>
    );
};

export default page;
