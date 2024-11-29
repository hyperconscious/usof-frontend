import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import AuthService from '../../services/AuthService';
import { notifyDismiss, notifyError, notifyLoading, notifySuccess } from '../../utils/notification';
import { joiResolver } from '@hookform/resolvers/joi';
import axios from 'axios';
import { passwordResetSchema, ResetPasswordData } from '../../validation/schemas';
import { SubmitHandler, useForm } from 'react-hook-form';
import InputField from '../../components/shared/InputField';

const PasswordResetPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [isPasswordReset, setIsPasswordReset] = useState<boolean>(false);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordData>({
        resolver: joiResolver(passwordResetSchema),
    });

    const onSubmit: SubmitHandler<ResetPasswordData> = async (data) => {

        const token = searchParams.get('token');
        if (!token) {
            notifyError("Invalid or missing token.");
            return;
        }

        const loadId = notifyLoading("Resetting your password...");
        try {
            await AuthService.resetPassword(token, data);
            notifyDismiss(loadId);
            notifySuccess("Password reset successfully! Redirecting to login page...");
            setIsPasswordReset(true);
            setTimeout(() => navigate('/auth/login'), 1000);
        } catch (error) {
            notifyDismiss(loadId);
            if (axios.isAxiosError(error)) {
                if (error.response && error.response.data && error.response.data.message) {
                    notifyError(error.response.data.message);
                } else {
                    notifyError("An unexpected error occurred. Please try again.");
                }
            } else {
                notifyError("An unexpected error occurred. Please try again.");
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            {isPasswordReset ? (
                <p className="mb-16">Your password has been reset successfully. Redirecting...</p>
            ) : (
                <>
                    <div className="flex items-center justify-center">
                        <div className="max-w-4xl bg-white rounded-md shadow-lg p-8">
                            <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Reset Password</h1>
                            <div className="flex flex-col md:flex-row items-center justify-between">
                                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center">
                                    <InputField
                                        label="Password"
                                        type="password"
                                        register={register('password')}
                                        error={errors.password?.message}
                                    />
                                    <InputField
                                        label="Password Confirmation"
                                        type="password"
                                        register={register('passwordConfirmation')}
                                        error={errors.passwordConfirmation?.message}
                                    />
                                    <button
                                        type="submit"
                                        className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
                                    >
                                        Reset Password
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default PasswordResetPage;
