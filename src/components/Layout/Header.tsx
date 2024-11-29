import { Link } from 'react-router-dom';
import AuthInfo from '../Auth/AuthInfo';
import { useState } from 'react';
import { TiThMenu, TiThMenuOutline } from 'react-icons/ti';
import { User } from '../../types/user';

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  return (
    <header className="bg-gray-800 text-white p-4 flex">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold flex items-center space-x-2">
          <img src="/logo.svg" alt="logo" className="w-10 h-10" />
          <span>Usof</span>
        </Link>
        <nav className="hidden md:flex space-x-4">
          <Link to="/posts" className="hover:text-gray-400 font-semibold">Posts</Link>
          <Link to="/categories" className="hover:text-gray-400 font-semibold">Tags</Link>
          {user?.role === 'admin' && <Link to="/users" className="hover:text-gray-400 font-semibold">Users</Link>}
        </nav>
        <div className="md:hidden ml-3">
          {menuOpen ? <TiThMenuOutline size={25} onClick={() => setMenuOpen(!menuOpen)} /> : <TiThMenu size={25} onClick={() => setMenuOpen(!menuOpen)} />}
        </div>
        {menuOpen && (
          <div className="absolute mt-40 w-48 bg-white rounded-md shadow-lg py-1">
            <Link to="/posts" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Posts</Link>
            <Link to="/categories" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Tags</Link>
            <Link to="/users" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Users</Link>
          </div>
        )}
        <AuthInfo setUser={setUser} />
      </div>
    </header>
  );
};

export default Header;
