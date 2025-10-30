import { useContext } from 'react'
import Sidebar from '../components/Sidebar'
import ChatContainer from '../components/ChatContainer'
import RightSidebar from '../components/RightSidebar'
import { ChatContext } from '../../context/ChatContext'

const HomePage = () => {
  const {selectedUser} = useContext(ChatContext)
  
  return (
    <div className="w-full h-screen overflow-hidden bg-black">
      <div className='w-full h-full sm:px-4 sm:py-4 lg:px-[10%] lg:py-[3%]'>
        <div className={`
          bg-gray-900 border border-gray-800 rounded-2xl
          overflow-hidden h-full grid relative shadow-2xl
          ${selectedUser 
            ? 'grid-cols-1 md:grid-cols-[300px_1fr] lg:grid-cols-[280px_1fr_300px]' 
            : 'grid-cols-1 md:grid-cols-[300px_1fr] lg:grid-cols-[350px_1fr]'
          }
        `}> 
          <Sidebar />
          <ChatContainer />
          {selectedUser && <RightSidebar />}
        </div>
      </div>
    </div>
  )
}

export default HomePage
