import assets from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { useState } from "react";
import { useEffect } from "react";

const Sidebar = () => {
  const { logout, onlineUsers } = useContext(AuthContext)
  const { getUser, user, selectedUser, setSelectedUser, unseenMessages, setUnseenMessages } = useContext(ChatContext)
  const [input, setInput] = useState("")
  const [showMenu, setShowMenu] = useState(false)
  const navigate = useNavigate();
  
  const filteredUsers = input ? (user || []).filter((user) => 
    user.fullName.toLowerCase().includes(input.toLowerCase())
  ) : (user || []);

  useEffect(() => {
    getUser();
  }, [onlineUsers])

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const aOnline = onlineUsers?.includes(a._id);
    const bOnline = onlineUsers?.includes(b._id);
    if (aOnline && !bOnline) return -1;
    if (!aOnline && bOnline) return 1;
    return 0;
  });

  return (
    <div className={`
      bg-black border-r border-gray-800 h-full overflow-y-auto text-white
      ${selectedUser ? "hidden md:flex" : "flex"} 
      flex-col
    `}>
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <h1 className="text-xl font-bold text-white">Synoro</h1>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="h-10 w-10 cursor-pointer hover:bg-gray-800 rounded-full flex items-center justify-center transition-colors touch-manipulation"
            >
              <svg 
                className="h-5 w-5 text-white" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
            
            {showMenu && (
              <>
                {/* Backdrop for mobile */}
                <div 
                  className="fixed inset-0 z-20 md:hidden" 
                  onClick={() => setShowMenu(false)}
                />
                
                <div className='absolute top-full right-0 z-30 w-40 p-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 shadow-lg'>
                  <button 
                    onClick={() => {
                      navigate('/profile')
                      setShowMenu(false)
                    }} 
                    className="w-full text-left cursor-pointer text-sm py-3 px-2 hover:text-blue-400 hover:bg-gray-700 rounded transition-colors"
                  >
                    Edit Profile
                  </button>
                  <hr className="my-2 border-t border-gray-600" />
                  <button 
                    onClick={() => {
                      logout()
                      setShowMenu(false)
                    }} 
                    className="w-full text-left cursor-pointer text-sm py-3 px-2 hover:text-red-400 hover:bg-gray-700 rounded transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        
        {/* Search */}
        <div className='bg-gray-800 rounded-full flex items-center gap-3 py-2.5 px-4 border border-gray-700'>
          <img src={assets.search_icon} alt="Search" className="w-4 h-4 opacity-70 filter invert" />
          <input 
            onChange={(e) => setInput(e.target.value)} 
            value={input}
            type="text" 
            className='bg-transparent border-none outline-none text-white text-sm placeholder-gray-500 flex-1' 
            placeholder="Search users..." 
          />
        </div>
      </div>
      {/* Users List */}
      <div className="flex-1 overflow-y-auto px-2">
        {sortedUsers.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            <p className="text-sm">No users found</p>
          </div>
        ) : (
          sortedUsers.map((user, index) => (
            <div 
              onClick={() => { 
                setSelectedUser(user); 
                setUnseenMessages(prev => ({...prev, [user._id]: 0}))
              }}
              key={index} 
              className={`
                relative flex items-center gap-3 p-3 mx-2 my-1 rounded-lg
                cursor-pointer transition-all duration-200 hover:bg-gray-800
                ${selectedUser?._id === user._id ? 'bg-gray-800 border-l-2 border-blue-500' : ''}
              `}
            >
              <div className="relative">
                <img 
                  src={user?.profilePic || assets.avatar_icon} 
                  alt=""
                  className='w-10 h-10 rounded-full object-cover' 
                />
                {(onlineUsers || []).includes(user._id) && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-black"></div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{user.fullName}</p>
                <span className={`text-xs ${
                  (onlineUsers || []).includes(user._id) 
                    ? 'text-green-400' 
                    : 'text-gray-400'
                }`}>
                  {(onlineUsers || []).includes(user._id) ? 'Online' : 'Offline'}
                </span>
              </div>
              
              {(unseenMessages && unseenMessages[user._id] > 0) && (
                <div className='bg-blue-500 text-white text-xs h-5 w-5 rounded-full flex items-center justify-center font-medium'>
                  {unseenMessages[user._id] > 9 ? '9+' : unseenMessages[user._id]}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Sidebar;
