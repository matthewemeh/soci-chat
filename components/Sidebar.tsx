import Chats from './Chats';
import Search from './Search';
import Navbar from './Navbar';

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <Navbar />
      <Search />
      <Chats />
    </div>
  );
};

export default Sidebar;
