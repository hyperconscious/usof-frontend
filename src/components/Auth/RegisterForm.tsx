import { useForm, SubmitHandler } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import { RegisterData, registerSchema } from '../../validation/schemas';
import InputField from '../shared/InputField';
import AuthService from '../../services/AuthService';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { notifyError, notifySuccess, notifyLoading, notifyDismiss } from '../../utils/notification';
import { useEffect } from 'react';
import AuthStore from '../../store/AuthStore';

const RegisterForm: React.FC = () => {
    const navigate = useNavigate();
    const tokens = AuthStore.getTokens();

    useEffect(() => {
        if (tokens.accessToken) {
            navigate('/');
        }
    }, [tokens, navigate]);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterData>({
        resolver: joiResolver(registerSchema),
    });

    const onSubmit: SubmitHandler<RegisterData> = async (data) => {
        const regId = notifyLoading("Registering your account...");
        try {
            await AuthService.register(data);
            await AuthService.sendVerificationEmail(data.email);
            notifyDismiss(regId);
            notifySuccess("Registration successful! Please check your email to confirm your account.", { duration: 8000 });
            navigate('/');
        } catch (error) {
            notifyDismiss(regId);
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
        <div className="flex items-center justify-center mt-36">
            <div className="w-full max-w-4xl bg-white rounded-md shadow-lg p-8">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Register</h1>
                <div className="flex flex-col md:flex-row justify-between">
                    <div className="md:w-1/2  p-8 rounded-md md:rounded-r-none">
                        <h2 className="text-4xl font-bold mb-4">Join Us Today!</h2>
                        <p className="text-lg mb-6">
                            Create an account and explore the amazing features we offer. Stay connected, manage your tasks, and grow with us.
                        </p>
                        <ul className="text-md mb-6 list-disc list-inside">
                            <li>Easy and fast registration</li>
                            <li>Exclusive access to premium content</li>
                            <li>Seamless profile management</li>
                        </ul>
                        <p className="text-md font-medium">
                            Take the first step toward a smarter and more productive life. Sign up now!
                        </p>
                    </div>
                    <div className="md:w-1/2 mt-8 md:mt-0 p-8">
                        <form onSubmit={handleSubmit(onSubmit)} noValidate>
                            <InputField
                                label="Login"
                                type="text"
                                register={register('login')}
                                error={errors.login?.message}
                            />
                            <InputField
                                label="Email"
                                type="email"
                                register={register('email')}
                                error={errors.email?.message}
                            />
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
                            <InputField
                                label="Full name"
                                type="text"
                                register={register('full_name')}
                                error={errors.full_name?.message}
                            />
                            <div className="flex justify-center mt-4">
                                <button
                                    type="submit"
                                    className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
                                >
                                    Register
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterForm;
