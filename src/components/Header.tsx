import { useNavigate } from "react-router-dom";
import { authService } from "../services/auth.service";
import { UserCircle } from "lucide-react";

export default function Header() {
    const navigate = useNavigate();
    const isAuthenticated = authService.isAuthenticated();
    const user = authService.getUser();

    const handleLogout = () => {
        authService.removeToken();
        navigate("/login");
    };

    return (
        <header className='fixed top-0 left-0 right-0 h-20'>
            <nav className='absolute top-0 w-full h-20'>
                <div className='h-full px-8 flex items-center justify-between'>
                    <div className='w-48'>
                        <button
                            onClick={() => navigate("/")}
                            className='flex items-center cursor-pointer hover:opacity-80 transition-opacity focus:outline-none'
                        >
                            <img
                                src='https://myquark-image-label.s3.ap-northeast-2.amazonaws.com/boltlab/reportable/reportable_v2_logo_white.svg'
                                alt='reportable logo'
                                className='h-8'
                            />
                        </button>
                    </div>

                    {isAuthenticated && (
                        <div className='w-48 flex justify-end items-center gap-3'>
                            <button
                                onClick={handleLogout}
                                className='px-4 py-2 text-gray-300 hover:text-white transition-colors'
                            >
                                Log out
                            </button>
                            <div className='w-8 h-8 rounded-full overflow-hidden bg-gray-800 flex items-center justify-center'>
                                {user?.profileImage ? (
                                    <img
                                        src={user.profileImage}
                                        alt={user.name}
                                        className='w-full h-full object-cover'
                                    />
                                ) : (
                                    <UserCircle className='w-6 h-6 text-gray-400' />
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </nav>
            <div className='absolute top-20 w-full border-b border-gray-800/50' />
        </header>
    );
}
