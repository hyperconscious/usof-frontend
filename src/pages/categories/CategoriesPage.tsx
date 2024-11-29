import React, { useEffect, useState } from "react";
import { Category } from "../../types/category";
import CategoryService from "../../services/CategoryService";
import Pagination from "../../components/shared/Pagination/Pagination";
import { useSearchParams } from "react-router-dom";
import SearchInput from "../../components/SearchInput";
import UserService from "../../services/UserService";
import { User } from "../../types/user";
import CategoryCard from "../../components/Category/CategoryCard";

const CategoriesPage: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [params, setSearchParams] = useSearchParams();
    const [page, setPage] = useState(() => parseInt(params.get('page') || '1'));
    const [total, setTotal] = useState(0);
    const [user, setUser] = useState<User | null>(null);
    const [search, setSearch] = useState(params.get('search') || '');
    const [showButton, setShowButton] = useState(user?.role === 'admin');
    const CategoriesPerPage = 36;
    const [itemsPerPage, setItemsPerPage] = useState(CategoriesPerPage);

    useEffect(() => {
        setItemsPerPage(page === 1 && showButton && user ? CategoriesPerPage - 1 : CategoriesPerPage);
    }, [page, showButton]);

    useEffect(() => {
        setShowButton(user?.role === 'admin');
    }, [user]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await UserService.getMyProfile();
                setUser(user);
            } catch (error) {
                console.error('Failed to fetch user:', error);
            }
        }

        fetchUser();
    }, []);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await CategoryService.getCategories({
                    page: page,
                    limit: itemsPerPage,
                    search: search === '' ? undefined : search,
                });
                setCategories(response.items);
                setTotal(response.total);
            } catch (error) {
                console.error('Failed to fetch comments:', error);
            }
        };
        fetchCategories();
    }, [page, search, itemsPerPage]);

    const handleAddCategory = () => {
        // setCategories([{ id: -1, title: 'New Category', description: 'Add a new category' }, ...categories]);
        setShowButton(false);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900">Tags</h1>
                    <p className="mt-2 text-gray-600">
                        A tag is a keyword or label that organizes your post with
                        other, similar posts. Using the right tags makes it easier for
                        others to find and engage with your content.
                    </p>
                </div>
            </header>

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

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {showButton && page === 1 && (
                        <button
                            onClick={handleAddCategory}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Add New Category
                        </button>
                    )}
                    {showButton || user?.role !== 'admin' ? null : <CategoryCard category={{ id: -1, title: 'New Category', description: 'Add a new category' }} user={user!} setShowButton={setShowButton} />}
                    {categories.map((cat) => (
                        <CategoryCard key={cat.id} category={cat} user={user!} setShowButton={setShowButton} />
                    ))}
                </div>

                {total !== 0 && (
                    <Pagination
                        page={page}
                        total={total}
                        itemsPerPage={itemsPerPage}
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
        </div>
    );
};

export default CategoriesPage;
