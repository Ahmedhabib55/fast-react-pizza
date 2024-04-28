import { Link } from 'react-router-dom';
import SearchOrder from '../features/order/SearchOrder';
import UserName from '../features/user/UserName';
import { useSelector } from 'react-redux';

function Header() {
  const userName = useSelector((state) => state.user.userName);
  return (
    <header className=" flex items-center justify-between border-b border-stone-200  bg-yellow-400 p-3 uppercase sm:px-6">
      <Link to="/" className="tracking-widest">
        Fast React Pizza co.
      </Link>
      <SearchOrder />
      {userName && <UserName />}
    </header>
  );
}

export default Header;
