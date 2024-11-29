import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import { CreatePostData, createPostSchema } from '../../validation/schemas';
import InputField from '../shared/InputField';
import { FaTag } from 'react-icons/fa';
import { ImCross } from 'react-icons/im';
import CategoryService from '../../services/CategoryService';
import { Category } from '../../types/category';
import PostService from '../../services/PostService';
import { notifyError, notifySuccess } from '../../utils/notification';
import { useNavigate } from 'react-router-dom';
import { Post } from '../../types/post';

type AddPostModalProps = {
    onClose: () => void;
    post?: Post;
};

const AddEditPostModal: React.FC<AddPostModalProps> = ({ onClose, post }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Category[]>([]);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        reset,
        formState: { errors },
    } = useForm<CreatePostData>({
        defaultValues: { categories: [] },
        resolver: joiResolver(createPostSchema),
    });

    useEffect(() => {
        if (post) {
            setValue('title', post.title);
            setValue('content', post.content, { shouldValidate: true, shouldDirty: true });
            setValue('categories', post.categories.map((cat) => cat.title));
            setValue('status', post.status);
        } else {
            reset();
        }
    }, [post, setValue, reset]);

    const onSubmit = (data: CreatePostData) => {
        if (post) {
            PostService.updatePost(post.id, data).then(() => {
                notifySuccess('Post updated successfully');
                onClose();
                setTimeout(() => navigate(0), 750);
            }).catch((error) => {
                console.error('Failed to update post:', error);
                notifyError('Failed to update post, please try again later');
            });
        } else {
            PostService.createPost(data).then((res) => {
                notifySuccess('Post created successfully');
                reset();
                onClose();
                navigate(`/posts/${res.id}`);
            }).catch((error) => {
                console.error('Failed to create post:', error);
                notifyError('Failed to create post, please try again later');
            });
        }
    };

    const addCategory = (category: string) => {
        const currentCategories = getValues('categories');
        if (!currentCategories.includes(category.trim())) {
            const updatedCategories = [...getValues('categories'), category];
            setValue('categories', updatedCategories);
        }
    };

    const removeCategory = (category: string) => {
        const currentCategories = getValues('categories');
        const updatedCategories = currentCategories.filter((cat) => cat !== category);
        setValue('categories', updatedCategories, { shouldValidate: true, shouldDirty: true });
    };

    const handleSearch = async (query: string) => {
        setSearchQuery(query);
        if (query === '') {
            setSearchResults([]);
            return;
        }
        try {
            const results = await CategoryService.getCategories({ page: 1, limit: 10, search: query });
            setSearchResults(results.items);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setSearchResults([]);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-[40rem] shadow-lg text-gray-700">
                <h2 className="text-xl font-bold mb-4">{post ? 'Edit Post' : 'Create New Post'}</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <InputField
                        label="Title"
                        type="text"
                        register={register('title')}
                        error={errors.title?.message}
                    />
                    <label className="block text-gray-700">Content</label>
                    <textarea
                        {...register('content')}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring ${errors.content ? 'border-red-500' : ''}`}
                        placeholder="Enter post content"
                        rows={window.innerWidth < 768 ? 4 : 12}
                        style={{ resize: 'none' }}
                    ></textarea>
                    {errors.content && (
                        <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
                    )}
                    <div className="mb-4">
                        <label className="block text-gray-700">Categories</label>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                            placeholder="Add a category"
                        />
                        <input type="hidden" value={getValues('categories')} {...register('categories')} />
                        {errors.categories && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.categories.message || 'Please select at least one category.'}
                            </p>
                        )}
                        {searchResults.length > 0 && (
                            <ul className="mt-2 border border-gray-300 rounded-lg max-h-48 overflow-auto">
                                {searchResults.map((cat) => (
                                    <li
                                        key={cat.title}
                                        className="px-4 py-2 cursor-pointer hover:bg-indigo-100"
                                        onClick={() => { addCategory(cat.title); handleSearch(''); }}
                                    >
                                        {cat.title}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div className="mb-4">
                        <div className="flex gap-2 mt-1 flex-wrap">
                            {getValues('categories').map((cat) => (
                                <span
                                    key={cat}
                                    className="bg-indigo-100 text-indigo-600 hover:text-indigo-700 text-xs font-semibold py-1 px-2 rounded-full cursor-pointer mt-2"
                                    onClick={() => removeCategory(cat)}
                                >
                                    <FaTag className="inline mr-1" size={12} />
                                    {cat}
                                    <ImCross className="inline ml-2" size={12} />
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Status</label>
                        <select
                            {...register('status')}
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring ${errors.status ? 'border-red-500' : ''}`}
                        >
                            <option value="">Select a status</option>
                            <option value="active">Published</option>
                            <option value="inactive">Draft</option>
                            <option value="locked">Locked</option>
                        </select>
                        {errors.status && (
                            <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>
                        )}
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
                        >
                            {post ? 'Save Changes' : 'Add Post'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEditPostModal;
