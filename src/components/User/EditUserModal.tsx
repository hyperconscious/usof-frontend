import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import { UpdateUserData } from '../../validation/schemas';
import InputField from '../shared/InputField';
import { notifyError, notifySuccess } from '../../utils/notification';
import { User } from '../../types/user';
import { updateUserDto } from '../../validation/schemas';
import UserService from '../../services/UserService';
import AuthService from '../../services/AuthService';

type EditUserModalProps = {
    onClose: () => void;
    me: User;
    user: User;
    setUser: React.Dispatch<React.SetStateAction<User>>;
};

const AddEditPostModal: React.FC<EditUserModalProps> = ({ onClose, me, user, setUser }) => {
    const [avatarFile, setAvatarFile] = useState<File | null>(null);

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm<UpdateUserData>({
        resolver: joiResolver(updateUserDto),
    });

    useEffect(() => {
        if (user) {
            setValue('full_name', user.full_name);
            setValue('login', user.login);
            setValue('email', user.email);
            setValue('role', user.role);
        } else {
            reset();
        }
    }, [user, setValue, reset]);

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setAvatarFile(event.target.files[0]);
        }
    };

    const onSubmit = async (data: UpdateUserData) => {
        try {
            if (data.email !== user.email) {
                AuthService.sendVerificationEmail(data.email!);
                notifySuccess('Please check your email to verify the account');
                data.verified = false;
            }
            await UserService.updateUserProfile(user.id, data);
            if (avatarFile) {
                const formData = new FormData();
                formData.append('avatar', avatarFile);
                await UserService.uploadAvatar(user.id, formData)
            }
            notifySuccess('User updated successfully');
            onClose();
            setUser((prev) => ({ ...prev, ...data }));
        } catch (error) {
            console.error('Failed to update user:', error);
            notifyError(`Failed to update user, please try again later`);
        }
    };

    return (
        <div onClick={(event) => event.stopPropagation()} className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-[34rem] shadow-lg text-gray-700">
                <h2 className="text-xl font-bold mb-4">Edit User</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <InputField
                        label="Full Name"
                        type="text"
                        register={register('full_name')}
                        error={errors.full_name?.message}
                    />
                    {me.role === 'admin' ?
                        <div className="mb-4">
                            <InputField
                                label="login"
                                type="text"
                                register={register('login')}
                                error={errors.login?.message}
                            />
                            <InputField
                                label="email"
                                type="email"
                                register={register('email')}
                                error={errors.email?.message}
                            />
                            <label className="block text-sm font-medium text-gray-700">
                                Role
                            </label>
                            <select
                                {...register('role')}
                                defaultValue={user.role}
                                className="mt-2 block w-full text-sm text-gray-700 border border-gray-300 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500 p-2"
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        :
                        <input type="hidden" value={user.role} {...register('role')} />
                    }
                    <input type="hidden" value={String(user.verified)} {...register('verified')} />
                    <div className="mb-4 flex flex-col">
                        <label className="block text-sm font-medium text-gray-700">
                            Profile Picture
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
                        />
                    </div>
                    <p>{errors.verified?.message}</p>
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
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEditPostModal;
