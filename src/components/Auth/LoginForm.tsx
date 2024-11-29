import { useForm, SubmitHandler } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import { LoginData, loginSchema } from '../../validation/schemas';
import InputField from '../shared/InputField';
import AuthService from '../../services/AuthService';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthStore from '../../store/AuthStore';
import { notifyDismiss, notifyError, notifyLoading, notifySuccess } from '../../utils/notification';
import { useEffect, useState } from 'react';

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const tokens = AuthStore.getTokens();
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (tokens.accessToken) {
      navigate('/');
    }
  }, [tokens, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: joiResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginData> = async (data) => {
    try {
      const { accessToken, refreshToken } = await AuthService.login(data);
      AuthStore.setTokens(accessToken, refreshToken);
      notifySuccess("Login successful!");
      window.location.href = '/';
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.data && error.response.data.message) {
          notifyError(error.response.data.message);
        } else {
          notifyError("An unexpected error occurred. Please try again.");
        }
        // console.error("Login error:", error);
      }
    }
  };

  const handleEmailAction = async () => {
    if (!email) {
      notifyError("Please enter a valid email.");
      return;
    }
    const emailId = notifyLoading(isPasswordReset ? 'Sending password reset link...' : 'Sending verification email...');
    try {
      isPasswordReset ? await AuthService.sendPasswordReset(email)
        : await AuthService.sendVerificationEmail(email);
      notifyDismiss(emailId);
      notifySuccess("Email sent successfully. Please check your inbox.");
      setShowEmailModal(false);
    } catch (error) {
      notifyDismiss(emailId);
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.data && error.response.data.message) {
          notifyError(error.response.data.message);
        } else {
          notifyError("An unexpected error occurred. Please try again.");
        }
      }
    }
  };

  return (
    <div className="flex items-center justify-center mt-36">
      <div className="w-full max-w-4xl bg-white rounded-md shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Login</h1>
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 p-8 text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-800">Welcome Back!</h1>
            <p className="mt-4 text-gray-600">
              Login to your account to access all features and manage your profile.
              If you haven't verified your email, you can resend the verification link below.
            </p>
            <button
              onClick={() => {
                setIsPasswordReset(false);
                setShowEmailModal(true)
              }}
              className="mt-4 bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 transition duration-300"
            >
              Send Verification Email
            </button>
          </div>
          <div className="md:w-1/2 mt-8 md:mt-0 p-8">
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <InputField
                label="Login or email"
                type="text"
                register={register('loginOrEmail')}
                error={errors.loginOrEmail?.message}
              />
              <InputField
                label="Password"
                type="password"
                register={register('password')}
                error={errors.password?.message}
              />
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 transition duration-300"
                >
                  Login
                </button>
              </div>
            </form>
            <p className="mt-4 text-center text-gray-600">
              Forgot password?{' '}
              <button
                onClick={() => {
                  setIsPasswordReset(true);
                  setShowEmailModal(true);
                }}
                className="text-blue-500 hover:underline"
              >
                Reset it here
              </button>
            </p>
          </div>
        </div>
      </div>

      {showEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            {isPasswordReset ? 'Reset Your Password' : 'Verify Your Email'}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mb-4 border border-gray-300 rounded"
              placeholder="Enter your email"
            />
            <div className="flex justify-between">
              <button
                onClick={() => setShowEmailModal(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleEmailAction}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LoginForm;
