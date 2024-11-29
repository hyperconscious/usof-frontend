import React, { useEffect, useState } from "react";
import Pagination from "../../components/shared/Pagination/Pagination";
import { useNavigate, useSearchParams } from "react-router-dom";
import SearchInput from "../../components/SearchInput";
import UserService from "../../services/UserService";
import { User } from "../../types/user";
import UserCard from "../../components/User/UserCard";

const CategoriesPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [params, setSearchParams] = useSearchParams();
    const [page, setPage] = useState(() => parseInt(params.get('page') || '1'));
    const [total, setTotal] = useState(0);
    const [user, setUser] = useState<User>({} as User);
    const [search, setSearch] = useState(params.get('search') || '');
    const navigate = useNavigate();
    // const [showButton, setShowButton] = useState(user?.role === 'admin');
    const UsersPerPage = 36;
    // const [itemsPerPage, setItemsPerPage] = useState(CategoriesPerPage);

    // useEffect(() => {
    //     setItemsPerPage(page === 1 && showButton && user ? CategoriesPerPage - 1 : CategoriesPerPage);
    // }, [page, showButton]);

    // useEffect(() => {
    //     setShowButton(user?.role === 'admin');
    // }, [user]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await UserService.getMyProfile();
                setUser(user);
                if (user.role !== 'admin') {
                    navigate(-1);
                }
            } catch (error) {
                console.error('Failed to fetch user:', error);
            }
        }

        fetchUser();
    }, [navigate]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await UserService.getUsers({
                    page: page,
                    limit: UsersPerPage,
                    search: search === '' ? undefined : search,
                });
                setUsers(response.items);
                setTotal(response.total);
            } catch (error) {
                console.error('Failed to fetch users:', error);
            }
        };
        fetchUsers();
    }, [page, search]);

    // const handleAddUser = () => {
    //     setShowButton(false);
    // };

    return (
        user.role !== 'admin' ? null :
            <div className="min-h-screen bg-gray-100">
                <header>
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-3xl font-bold text-gray-900">Users</h1>
                        <p className="mt-2 text-gray-600">
                            Users are individuals who have registered on the platform. You can view and manage user profiles here.
                        </p>
                    </div>
                </header >

                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-4">
                        <SearchInput
                            searchInput={search}
                            minLength={0}
                            onSearchInputChange={(value) => {
                                setSearch(value);
                                setSearchParams((prev) => {
                                    const newParams = new URLSearchParams(prev);
                                    newParams.set('search', search);
                                    newParams.set('page', '1');
                                    return newParams;
                                });
                            }}
                            onSearchKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    setSearchParams((prev) => {
                                        const newParams = new URLSearchParams(prev);
                                        newParams.set('search', search);
                                        newParams.set('page', '1');
                                        return newParams;
                                    });
                                }
                            }}
                        />
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white shadow-md rounded-lg">
                            <thead className="bg-gray-800 text-white">
                                <tr>
                                    <th className="py-3 px-6 text-left">ID</th>
                                    <th className="py-3 px-6 text-center">Avatar</th>
                                    <th className="py-3 px-6 text-left">Login</th>
                                    <th className="py-3 px-6 text-left">Full Name</th>
                                    <th className="py-3 px-6 text-left">Email</th>
                                    <th className="py-3 px-6 text-left">Role</th>
                                    <th className="py-3 px-6 text-left">Verified</th>
                                    <th className="py-3 px-6 text-left">Ratings</th>
                                    <th className="py-3 px-6 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* {showButton && page === 1 && (
                        <button
                            onClick={handleAddUser}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Add New Category
                        </button>
                    )} */}
                                {/* {showButton || user?.role !== 'admin' ? null : <CategoryCard category={{ id: -1, title: 'New Category', description: 'Add a new category' }} user={user!} setShowButton={setShowButton} />} */}
                                {users.map((u) => (
                                    <UserCard key={u.id} user={u} currUser={user!} /> // setShowButton={setShowButton}
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {total !== 0 && (
                        <Pagination
                            page={page}
                            total={total}
                            itemsPerPage={UsersPerPage}
                            onPageChange={(newPage) => {
                                setPage(newPage);
                                setSearchParams((prevs) => {
                                    const newParams = new URLSearchParams(prevs);
                                    newParams.set('page', newPage.toString());
                                    return newParams;
                                });
                            }}
                        />
                    )}
                </div>
            </div >
    );
};

export default CategoriesPage;
