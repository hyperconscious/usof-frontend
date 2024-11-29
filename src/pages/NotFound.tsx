import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <h1 className="text-6xl font-extrabold text-red-500 mb-4">404</h1>
    <h2 className="text-2xl font-semibold text-gray-700 mb-2">
      Page Not Found
    </h2>
    <p className="text-lg text-gray-500 mb-6">
      Oops! The page you're looking for doesn't exist or was moved.
    </p>
    <Link
      to="/"
      className="px-6 py-3 bg-gray-800 text-white text-lg rounded-md shadow-md hover:bg-gray-900 transition duration-200"
    >
      Go Back Home
    </Link>
  </div>
);

export default NotFound;
