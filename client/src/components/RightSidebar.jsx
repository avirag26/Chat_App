import { useContext, useEffect, useState } from "react";
import assets from "../assets/assets";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";

const RightSidebar = () => {
  const { selectedUser, messages } = useContext(ChatContext);
  const {  onlineUsers } = useContext(AuthContext);
  const [msgImage, setImages] = useState([])

  // get all the images from the messages 

  useEffect(() => {
    setImages(
      (messages || []).filter(msg => msg.image).map(msg => msg.image)
    )
  }, [messages])
  return (
    selectedUser && (
      <div className="bg-black border-l border-gray-800 text-white w-full relative overflow-y-auto hidden lg:flex lg:flex-col">
        {/* Profile Section */}
        <div className="p-6 flex flex-col items-center text-center border-b border-gray-800">
          <div className="relative mb-4">
            <img
              src={selectedUser?.profilePic || assets.avatar_icon}
              alt=""
              className="w-20 h-20 rounded-full object-cover"
            />
            {(onlineUsers || []).includes(selectedUser._id) && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black"></div>
            )}
          </div>

          <h1 className="text-lg font-semibold mb-2 px-4">
            {selectedUser.fullName}
          </h1>

          <p className={`text-xs mb-3 ${(onlineUsers || []).includes(selectedUser._id)
            ? 'text-green-400'
            : 'text-gray-400'
            }`}>
            {(onlineUsers || []).includes(selectedUser._id) ? 'Online' : 'Offline'}
          </p>

          {selectedUser.bio && (
            <p className="text-sm text-gray-300 px-4 leading-relaxed">
              {selectedUser.bio}
            </p>
          )}
        </div>

        {/* Media Section */}
        <div className="flex-1 p-4">
          <h3 className="text-sm font-medium mb-3 text-gray-300">Shared Media</h3>
          {msgImage.length > 0 ? (
            <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto">
              {msgImage.map((url, index) => (
                <div
                  key={index}
                  onClick={() => window.open(url)}
                  className="cursor-pointer rounded-lg overflow-hidden hover:opacity-80 transition-opacity"
                >
                  <img
                    src={url}
                    alt=""
                    className="w-full h-20 object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400 py-8">
              <p className="text-sm">No media shared yet</p>
            </div>
          )}
        </div>

      
        
      </div>
    )
  );
};

export default RightSidebar;
