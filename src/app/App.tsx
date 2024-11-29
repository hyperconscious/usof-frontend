import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import PostsPage from '../pages/posts/PostsPage';
import NotFound from '../pages/NotFound';
import Layout from '../components/Layout/Layout';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import EmailVerificationPage from '../pages/auth/EmailVerificationPage';
import { Toaster } from 'react-hot-toast';
import PasswordResetPage from '../pages/auth/PasswordResetPage';
import UserProfilePage from '../pages/user/UserProfilePage';
import PostPage from '../pages/posts/PostPage';
import CategoriesPage from '../pages/categories/CategoriesPage';
import UsersPage from '../pages/user/UsersPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/posts" />} />
          <Route path="/posts" element={<PostsPage />} />
          <Route path="/posts/:id" element={<PostPage />} />

          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/register" element={<RegisterPage />} />
          <Route path="/auth/verify-email" element={<EmailVerificationPage />} />
          <Route path="/auth/reset-password" element={<PasswordResetPage />} />

          <Route path="/users" element={<UsersPage />} />
          <Route path="/users/my-profile" element={<UserProfilePage />} />
          <Route path="/users/:id" element={<UserProfilePage />} />

          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
      <Toaster />
    </Router>
  );
}

export default App;
