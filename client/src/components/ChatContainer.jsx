import { useContext, useEffect, useRef, useState } from 'react'
import assets from '../assets/assets'
import { formatMessageTime } from '../lib/utils'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const ChatContainer = () => {
  const {messages, selectedUser, setSelectedUser, sendMessage, getMessages} = useContext(ChatContext);
  const {authUser, onlineUsers} = useContext(AuthContext)
  const scrollEnd = useRef()
  const [input, setInput] = useState("");

  const handleSendMessage = async (e)=>{
   e.preventDefault();
   if(input.trim() === "") return null;
   await sendMessage({text:input.trim()});
   setInput("")
  }

  const handleSendImage = async (e) =>{
    const file = e.target.files[0];
    if(!file || !file.type.startsWith("image/")){
      toast.error("Select an image file")
      return;
    }
    const reader = new FileReader();
    reader.onloadend = async ()=>{
      await sendMessage({image:reader.result})
    }
    reader.readAsDataURL(file)
    e.target.value = ""
  }
  useEffect(()=>{
    if(selectedUser){
      getMessages(selectedUser._id)
    }
  },[selectedUser])

  useEffect(() => {
    if (scrollEnd.current && messages) {
      scrollEnd.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  return selectedUser ? (
    <div className='h-full flex flex-col relative bg-gray-900 overflow-hidden'>
      {/* Header */}
      <div className='flex items-center gap-3 py-3 px-4 border-b border-gray-800 bg-black'>
        <button
          onClick={() => setSelectedUser(null)}
          className='md:hidden p-1 hover:bg-gray-800 rounded-full transition-colors'
        >
          <img src={assets.arrow_icon} alt='Back' className='w-5 h-5 rotate-180 filter invert' />
        </button>
        
        <div className="relative">
          <img 
            src={selectedUser.profilePic || assets.avatar_icon} 
            alt='' 
            className='w-10 h-10 rounded-full object-cover' 
          />
          {(onlineUsers || []).includes(selectedUser._id) && (
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-black"></div>
          )}
        </div>
        
        <div className='flex-1'>
          <p className='text-white font-medium text-base md:text-lg'>
            {selectedUser.fullName}
          </p>
          <p className={`text-xs ${
            (onlineUsers || []).includes(selectedUser._id) 
              ? 'text-green-400' 
              : 'text-gray-400'
          }`}>
            {(onlineUsers || []).includes(selectedUser._id) ? 'Online' : 'Offline'}
          </p>
        </div>
        
        <img src={assets.help_icon} alt='' className='hidden md:block w-5 h-5 opacity-70 hover:opacity-100 cursor-pointer filter invert' />
      </div>

      {/* Messages Area */}
      <div className='flex-1 overflow-y-auto p-4 pb-20 space-y-4 bg-black'>
        {(messages || []).length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
              <span className="text-white font-bold text-2xl">S</span>
            </div>
            <p className='text-center'>Start a conversation with {selectedUser.fullName}</p>
          </div>
        ) : (
          (messages || []).map((msg, index) => (
            <div
              key={index}
              className={`flex items-end gap-2 ${
                msg.senderId === authUser?._id ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.senderId !== authUser?._id && (
                <img
                  src={selectedUser?.profilePic || assets.avatar_icon}
                  alt=''
                  className='w-8 h-8 rounded-full object-cover mb-1'
                />
              )}
              
              <div className={`flex flex-col ${
                msg.senderId === authUser?._id ? 'items-end' : 'items-start'
              }`}>
                {msg.image ? (
                  <img
                    src={msg.image}
                    alt=''
                    className='max-w-[250px] md:max-w-[300px] rounded-lg border border-gray-700 cursor-pointer hover:opacity-90'
                    onClick={() => window.open(msg.image)}
                  />
                ) : (
                  <div
                    className={`px-4 py-2 max-w-[280px] md:max-w-[350px] text-sm rounded-2xl break-words ${
                      msg.senderId === authUser?._id
                        ? 'bg-blue-500 text-white rounded-br-md'
                        : 'bg-gray-800 text-white rounded-bl-md'
                    }`}
                  >
                    {msg.text}
                  </div>
                )}
                <p className='text-xs text-gray-500 mt-1 px-2'>
                  {formatMessageTime(msg.createdAt)}
                </p>
              </div>
              
              {msg.senderId === authUser?._id && (
                <img
                  src={authUser?.profilePic || assets.avatar_icon}
                  alt=''
                  className='w-8 h-8 rounded-full object-cover mb-1'
                />
              )}
            </div>
          ))
        )}
        <div ref={scrollEnd}></div>
      </div>

      {/* Message Input */}
      <div className='absolute bottom-0 left-0 right-0 p-4 bg-black border-t border-gray-800'>
        <form onSubmit={handleSendMessage} className='flex items-center gap-3'>
          <div className='flex-1 flex items-center bg-gray-800 rounded-full px-4 py-2 border border-gray-700'>
            <input
              onChange={(e) => setInput(e.target.value)}
              value={input}
              type='text'
              placeholder='Type a message...'
              className='flex-1 bg-transparent text-white text-sm outline-none placeholder-gray-500'
            />
            <input 
              onChange={handleSendImage} 
              type='file' 
              id='image' 
              accept='image/*' 
              hidden 
            />
            <label htmlFor='image' className='cursor-pointer p-2 hover:bg-gray-700 rounded-full transition-colors'>
              <svg 
                className="w-5 h-5 text-gray-400 hover:text-white transition-colors" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </label>
          </div>
          <button
            type="submit"
            disabled={!input.trim()}
            className='p-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-full transition-colors'
          >
            <img src={assets.send_button} alt='Send' className='w-5 h-5 filter invert' />
          </button>
        </form>
      </div>
    </div>
  ) : (
    <div className='flex flex-col items-center justify-center gap-4 text-gray-500 bg-gray-900 max-md:hidden'>
      <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
        <span className="text-white font-bold text-3xl">S</span>
      </div>
      <div className="text-center">
        <h1 className='text-2xl font-bold text-white mb-2'>Welcome to Synoro</h1>
        <p className='text-gray-400'>Select a conversation to start chatting</p>
      </div>
    </div>
  )
}

export default ChatContainer
