import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { authService } from "../services/auth.service";

export default function Login() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const code = searchParams.get("code");
        if (code) {
            handleGoogleCallback(code);
        }
    }, [searchParams]);

    const handleGoogleCallback = (token: string) => {
        try {
            authService.setToken(token);
            navigate("/");
        } catch (error) {
            console.error("Google callback error:", error);
        }
    };

    const handleGoogleLogin = () => {
        authService.googleLogin();
    };

    return (
        <div className='h-[calc(100vh-81px)] bg-gray-950 flex items-center justify-center px-4'>
            <div className='absolute inset-0 overflow-hidden'>
                <div className='absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl' />
                <div className='absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl' />
            </div>

            <div className='w-full max-w-md relative'>
                <div className='bg-gray-900/50 backdrop-blur-xl p-8 rounded-2xl border border-gray-800'>
                    <div className='text-center mb-8'>
                        <button
                            onClick={() => navigate("/")}
                            className='inline-block hover:opacity-80 transition-opacity'
                        >
                            <img
                                src='https://myquark-image-label.s3.ap-northeast-2.amazonaws.com/boltlab/reportable/reportable_v2_icon.svg'
                                alt='reportable icon'
                                className='w-16 mx-auto mb-6'
                            />
                        </button>
                        <h1 className='text-2xl font-bold mb-2 text-white'>Welcome to Reportable</h1>
                        <p className='text-gray-400'>Sign in to start creating professional documents</p>
                    </div>

                    <button
                        onClick={handleGoogleLogin}
                        className='w-full flex items-center justify-center gap-3 bg-white text-gray-900 font-medium px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors'
                    >
                        <img src='https://www.google.com/favicon.ico' alt='Google' className='w-5 h-5' />
                        Continue with Google
                    </button>

                    <p className='mt-6 text-center text-sm text-gray-500'>
                        By continuing, you agree to our Terms of Service and Privacy Policy
                    </p>
                </div>
            </div>
        </div>
    );
}
