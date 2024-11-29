import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import UserService from '../../services/UserService';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { User } from '../../types/user';
import PostsList from '../../components/Post/PostsList';
import { PostServiceType, usePosts } from '../../hooks/usePosts';
import Pagination from '../../components/shared/Pagination/Pagination';
import { notifyError } from '../../utils/notification';
import UserManipulation from '../../components/User/UserManipulation';
import config from '../../config/env.config';

const UserProfile: React.FC = () => {
    const [params, setSearchParams] = useSearchParams();
    const { id } = useParams<{ id: string }>();
    const [user, setUser] = useState<User>({} as User);
    const [me, setMe] = useState<User>({} as User);
    const [activeTab, setActiveTab] = useState(() => params.get('tab') || 'userPosts');
    const [page, setPage] = useState(() => parseInt(params.get('page') || '1'));
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const i = await UserService.getMyProfile()
                const user = id ? await UserService.getUserProfile(Number(id)) : i;
                setMe(i);
                setUser(user);
            } catch (error) {
                notifyError('Please create an account to view this page.');
                navigate('/404');
            } finally {
                setIsLoading(false);
            }
        };
        fetchUserData();
    }, [id]);

    const { posts, total, loading, error, setParams, refetch } = usePosts(
        activeTab === 'likedPosts'
            ? PostServiceType.LIKED
            : activeTab === 'savedPosts'
                ? PostServiceType.SAVED
                : PostServiceType.MY_POSTS,
        {
            page,
            limit: 12,
            sortField: 'publishDate',
            sortDirection: 'DESC',
        },
        String(user.id),
    );

    const handleTabChange = (tab: string) => {
        setSearchParams((prevs) => {
            const newParams = new URLSearchParams(prevs);
            newParams.set('page', '1');
            newParams.set('tab', tab);
            setParams((prev) => ({
                ...prev,
                page: 1,
            }));
            return newParams;
        });
        setActiveTab(tab);
    };

    return (
        <div className="max-w-7xl mx-auto mt-8 p-6">
            <div className="bg-white p-6 rounded-lg shadow-lg mb-8 flex flex-wrap items-center justify-between">
                <div className="flex items-center flex-wrap ">
                    <div className='flext itenms-items-center space-y-16'>
                        <img
                            src={user.avatar ? `${config.BACKEND_URL}${user.avatar}` : '/avatars/default_avatar.png'}
                            alt="User Avatar"
                            className="w-40 h-40 rounded-full object-cover border border-gray-300"
                        />
                    </div>
                    <div className="ml-6">
                        <h2 className="text-2xl font-semibold text-gray-800 break-words">{user?.full_name}</h2>
                        <p className="text-gray-600">@{user?.login}</p>
                        <p className="text-gray-600">{user?.email}</p>
                        <p className="text-gray-600">Verified {user?.verified ? '✔️' : '❌'}</p>
                        <p className="text-gray-600">Role: {user?.role}</p>
                    </div>
                </div>

                <div className='flex space-x-8 p-10 items-center mb-10'>
                    <div className="w-20 h-20">
                        <CircularProgressbar
                            value={user?.publisherRating || 0}
                            maxValue={10}
                            text={`${user?.publisherRating || 0}/10.0`}
                            styles={buildStyles({
                                pathColor: user?.publisherRating > 7 ? '#4caf50' : user?.publisherRating > 4 ? '#ff9800' : '#f44336',
                                textColor: '#3b3b3b',
                                trailColor: '#d6d6d6',
                                textSize: '18px',
                            })}
                        />
                        <p className="text-center mt-2 text-gray-600 font-semibold">Publisher Rating</p>
                    </div>
                    <div className="w-20 h-20">
                        <CircularProgressbar
                            value={user?.commentatorRating || 0}
                            maxValue={10}
                            text={`${user?.commentatorRating || 0}/10.0`}
                            styles={buildStyles({
                                pathColor: user?.commentatorRating > 7 ? '#4caf50' : user?.commentatorRating > 4 ? '#ff9800' : '#f44336',
                                textColor: '#3b3b3b',
                                trailColor: '#d6d6d6',
                                textSize: '16px',
                            })}
                        />
                        <p className="text-center mt-2 text-gray-600 font-semibold">Commentator Rating</p>
                    </div>
                </div>
                <UserManipulation
                    me={me}
                    user={user}
                    setUser={setUser}
                />
            </div>

            <div className="mb-8">
                <button
                    className={`px-4 py-2 rounded-lg mr-4 ${activeTab === 'userPosts' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
                    onClick={() => handleTabChange('userPosts')}
                >
                    User Posts
                </button>
                <button
                    className={`px-4 py-2 rounded-lg mr-4 ${activeTab === 'likedPosts' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
                    onClick={() => handleTabChange('likedPosts')}
                >
                    Liked Posts
                </button>
                {(window.location.pathname.includes('/my-profile')) ?
                    <button
                        className={`px-4 py-2 rounded-lg ${activeTab === 'savedPosts' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
                        onClick={() => handleTabChange('savedPosts')}
                    >
                        Saved Posts
                    </button>
                    : null}
            </div>

            <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Posts</h3>
                {
                    (isLoading || loading || !user?.id) ? (
                        <p className="mt-5 text-xl text-center text-gray-500" > Loading...</p>
                    ) : error ? (
                        <div className="mt-5 text-xl text-center text-gray-500">
                            <p>{error}</p>
                            <button
                                className="mt-3 px-6 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
                                onClick={refetch}
                            >
                                Retry
                            </button>
                        </div>
                    ) : (
                        <>
                            <PostsList posts={posts} />
                            {total !== 0 && (
                                <Pagination
                                    page={page}
                                    total={total}
                                    onPageChange={(newPage) => {
                                        setParams((prev) => ({ ...prev, page: newPage }));
                                        setSearchParams((prevs) => {
                                            const newParams = new URLSearchParams(prevs);
                                            newParams.set('tab', activeTab);
                                            newParams.set('page', newPage.toString());
                                            return newParams;
                                        });
                                        setPage(newPage);
                                    }
                                    }
                                />
                            )}
                        </>
                    )}
            </div>
        </div>
    );
};

export default UserProfile;
