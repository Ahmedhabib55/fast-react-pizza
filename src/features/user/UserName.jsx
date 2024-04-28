import { useSelector } from 'react-redux';

function UserName() {
  const userName = useSelector((state) => state.user.userName);
  return <div className="text-sm font-semibold md:block">{userName}</div>;
}

export default UserName;
