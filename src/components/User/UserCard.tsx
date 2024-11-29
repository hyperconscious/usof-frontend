import React, { useState } from 'react';
import { User } from '../../types/user';
import UserManipulation from './UserManipulation';
import { useNavigate } from 'react-router-dom';
import config from '../../config/env.config';

interface UserCardProps {
    user: User;
    currUser: User;
    // setShowButton?: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserCard: React.FC<UserCardProps> = ({ user, currUser }) => {
    const [isHidden, setIsHidden] = useState(false);
    const [userState, setUser] = useState<User>(user);
    const navigate = useNavigate();

    const hideUser = () => {
        setIsHidden(true);
    };

    if (isHidden) {
        return null;
    }

    return (
        isHidden ? null : (
            <tr key={userState.id} onClick={() => navigate(`/users/${userState.id}`)} className="border-b hover:bg-gray-100">
                <td className="py-3 px-6 text-left text-gray-700">{user.id}</td>
                <td className="py-3 px-6 text-left text-gray-700">
                    <img
                        src={userState.avatar ? `${config.BACKEND_URL}${userState.avatar}` : '/avatars/default_avatar.png'}
                        alt={`${userState.full_name}'s avatar`}
                        className="w-12 h-12 rounded-full"
                    />
                </td>
                <td className="py-3 px-6 text-left text-gray-700">@{userState.login}</td>
                <td className="py-3 px-6 text-left text-gray-700">{userState.full_name}</td>
                <td className="py-3 px-6 text-left text-gray-700">{userState.email}</td>
                <td className="py-3 px-6 text-left text-gray-700 capitalize">{user.role}</td>
                <td className="py-3 px-6 text-left">
                    <span
                        className={`px-3 py-1 rounded-full text-sm ${userState.verified
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                            }`}
                    >
                        {userState.verified ? 'Yes' : 'No'}
                    </span>
                </td>
                <td className="py-3 px-6 text-left text-gray-700">
                    Publisher: {userState.publisherRating} <br />
                    Commentator: {userState.commentatorRating}
                </td>
                <td className="py-3 px-6 text-center">
                    <UserManipulation
                        me={currUser}
                        user={user}
                        setUser={setUser}
                        hideUser={hideUser}
                    />
                </td>
            </tr>
        )
    );
}
{/* <div className="mb-4">
                </div> */}
// <div className="mb-2">
//     <p className="text-gray-600">Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
//     <p className="text-gray-600">Last Updated: {new Date(user.updatedAt).toLocaleDateString()}</p>
// </div>
// <div className="mb-2">
//     <h2 className="text-xl font-semibold">{user.full_name}</h2>
//     <p className="text-gray-600">@{user.login}</p>
// </div>
// <div className="mb-2">
//     <p className="text-gray-800">{user.email}</p>
// </div>
// <div className="mb-2">
//     <p className="text-gray-800">Publisher Rating: {user.publisherRating}</p>
//     <p className="text-gray-800">Commentator Rating: {user.commentatorRating}</p>
// </div>
// <div className="mb-2">
//     <p className="text-gray-800">Role: {user.role}</p>
// </div>

export default UserCard;
