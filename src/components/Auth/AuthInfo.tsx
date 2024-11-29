import { Link, useNavigate } from 'react-router-dom';
import UserService from '../../services/UserService';
import { useEffect, useState } from 'react';
import { User } from '../../types/user';
import AuthStore from '../../store/AuthStore';
import { FaPlus, FaRegUser, FaShieldAlt } from "react-icons/fa";
import { notifyError } from '../../utils/notification';
import AddEditPostModal from '../Post/AddEditPostModal';
import config from '../../config/env.config';

interface AuthInfoProps {
    setUser: (user: User | null) => void;
}

const AuthInfo: React.FC<AuthInfoProps> = ({ setUser }) => {
    const [user, setLogged] = useState<User | null>(null);
    const [tokens, setTokens] = useState(AuthStore.getTokens());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    const handleModalToggle = () => {
        if (!user) {
            notifyError('You need to be logged in to add a post');
            return;
        }
        setIsModalOpen(!isModalOpen);
    };

    const handleLogout = async () => {
        AuthStore.removeTokens();
        setTokens({ accessToken: null, refreshToken: null });
        setUser(null);
        setLogged(null)
        navigate('/');
    };

    useEffect(() => {
        const fetchUser = async () => {
            if (tokens.accessToken && tokens.refreshToken) {
                try {
                    const user = await UserService.getMyProfile()
                    setUser(user);
                    setLogged(user);
                } catch (error) {
                    console.error('Failed to fetch user profile', error);
                }
            }
        };
        fetchUser();
    }, [tokens]);

    return (
        <div className="flex items-center justify-between px-4">
            <div className="flex items-center md:mr-24 max-sm:hidden">
                {user?.role === 'admin' ? <FaShieldAlt /> : <FaRegUser />}
                <p className='ml-4'>{user && user.role.charAt(0).toUpperCase() + user?.role.slice(1)}</p>
            </div>
            <nav>
                {user ? (
                    <div className="flex items-center md:space-x-6 ">
                        <button
                            onClick={handleModalToggle}
                            className="w-8 h-8 rounded bg-blue-800 hover:bg-blue-900 text-white flex items-center justify-center mr-5"
                            title='Add Post'
                        >
                            <FaPlus size={18} />
                        </button>
                        <Link to="users/my-profile" className="text-white flex justify-center items-center">
                            <img
                                src={user.avatar ? `${config.BACKEND_URL}${user.avatar}` : '/avatars/default_avatar.png'}
                                alt="User Avatar"
                                className="w-12 h-12 rounded-full object-cover mr-2 ml-2"
                            />
                            {user.full_name}
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <div>
                        <Link to="/auth/login" className="mr-4 hover:underline">
                            Sign In
                        </Link>
                        <Link to="/auth/register" className="hover:underline">
                            Sign Up
                        </Link>
                    </div>
                )}
            </nav>
            {isModalOpen && <AddEditPostModal onClose={handleModalToggle} />}
        </div>
    );
};

export default AuthInfo;
