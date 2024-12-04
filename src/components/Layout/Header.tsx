import { Link, useNavigate } from 'react-router-dom';
import AuthInfo from '../Auth/AuthInfo';
import { useState, useEffect } from 'react';
import { TiThMenu, TiThMenuOutline } from 'react-icons/ti';
import { User } from '../../types/user';
import SearchInput from '../SearchInput';
import UserService from '../../services/UserService';

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (search) {
      fetchUsers();
    } else {
      setUsers([]);
    }
  }, [search]);

  const fetchUsers = async () => {
    try {
      const response = await UserService.getUsers({
        page: 1,
        limit: 10,
        search: search,
      });
      setUsers(response.items);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  return (
    <header className="bg-gray-800 text-white p-4 flex">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex justify-between items-center w-full md:w-auto">
          <Link to="/" className="text-2xl font-bold flex items-center space-x-2">
            <img src="/logo.svg" alt="logo" className="w-10 h-10" />
            <span>Usof</span>
          </Link>
          <div className="md:hidden ml-3">
            {menuOpen ? <TiThMenuOutline size={25} onClick={() => setMenuOpen(!menuOpen)} /> : <TiThMenu size={25} onClick={() => setMenuOpen(!menuOpen)} />}
          </div>
        </div>
        <nav className="hidden md:flex space-x-4 items-center">
          <Link to="/posts" className="hover:text-gray-400 font-semibold">Posts</Link>
          <Link to="/categories" className="hover:text-gray-400 font-semibold">Tags</Link>
          {user?.role === 'admin' && <Link to="/users" className="hover:text-gray-400 font-semibold">Users</Link>}
          {user && <div className="flex-1 mx-7 ml-20">
            <SearchInput
              minLength={0}
              searchInput={search}
              onSearchInputChange={(value) => setSearch(value)}
              onSearchKeyPress={(e) => {
                if (e.key === 'Enter') {
                  fetchUsers();
                }
              }}
            />
            {users.length > 0 && (
              <div className="bg-white text-black mt-2 rounded-md shadow-lg absolute z-10 opacity-90">
                {users.map((user) => (
                  <div key={user.id} onClick={() => { navigate(`/users/${user.id}`); setSearch('') }} className="px-4 py-2 hover:bg-gray-200 cursor-pointer">
                    {user.full_name} (@{user.login})
                  </div>
                ))}
              </div>
            )}
          </div>}
        </nav>
        {menuOpen && (
          <div className="absolute right-0 top-14 w-48 bg-white rounded-md shadow-lg py-1">
            <Link onClick={() => setMenuOpen(!menuOpen)} to="/posts" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Posts</Link>
            <Link onClick={() => setMenuOpen(!menuOpen)} to="/categories" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Tags</Link>
            <Link onClick={() => setMenuOpen(!menuOpen)} to="/users" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Users</Link>
          </div>
        )}
        <AuthInfo setUser={setUser} />
      </div>
    </header>
  );
};

export default Header;
