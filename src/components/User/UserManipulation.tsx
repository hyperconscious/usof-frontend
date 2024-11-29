import { User } from '../../types/user';
import { notifyError, notifySuccess } from '../../utils/notification';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useState } from 'react';
import EditUserModal from './EditUserModal';
import UserService from '../../services/UserService';
import AuthStore from '../../store/AuthStore';
import { useNavigate } from 'react-router-dom';

interface UserManipulationProps {
    me: User;
    user: User;
    setUser: React.Dispatch<React.SetStateAction<User>>;
    hideUser?: () => void;
}

const UserManipulation: React.FC<UserManipulationProps> = ({ me, user, setUser, hideUser }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    const handleModalToggle = () => {
        if (!user) {
            notifyError('Something went wrong.');
            return;
        }
        setIsModalOpen(!isModalOpen);
    };

    const handleEdit = (event: React.MouseEvent) => {
        event.stopPropagation();
        handleModalToggle();
    };

    const handleDelete = async (event: React.MouseEvent) => {
        event.stopPropagation();
        if (window.confirm(`Are you sure you want to delete an account?This action cannot be undone.It will delete all posts and comments associated with this account.`)) {
            try {
                await UserService.deleteUserProfile(user.id);
                me.id === user.id && AuthStore.removeTokens();
                notifySuccess('User deleted successfully');
                hideUser ? hideUser() : setTimeout(() => navigate('/'), 750);
            } catch (error) {
                notifyError('Failed to delete user');
            }
        }
    };

    return (
        <div className="mt-4 flex items-center justify-between text-gray-600">
            {user.id === me.id || me.role === 'admin' ? (
                <div className="flex items-center space-x-4">
                    <button onClick={handleEdit} className="flex items-center space-x-1 text-yellow-600 hover:text-yellow-800">
                        <FaEdit size={22} />
                    </button>
                    <button onClick={handleDelete} className="flex items-center space-x-1 text-gray-600 hover:text-red-800">
                        <FaTrash size={22} />
                    </button>
                    {isModalOpen && (
                        <div>
                            <EditUserModal onClose={handleModalToggle} me={me} user={user} setUser={setUser} />
                        </div>
                    )}
                </div>
            ) : null}
        </div>
    );
};

export default UserManipulation;
