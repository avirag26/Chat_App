import { useState, useContext } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../../context/AuthContext';

const LoginPage = () => {
  const [currentState, setCurrentState] = useState("Sign up")
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

  const {login} = useContext(AuthContext)

  const onSubmitHandler = (event) => {
    event.preventDefault();

    if(currentState === 'Sign up' && !isDataSubmitted){
      setIsDataSubmitted(true);
      return;
    }
    login(currentState === "Sign up" ? "signup" : "login", {fullName, email, password, bio})
  }

  return (
    <div className='min-h-screen flex items-center justify-center p-4 bg-black'>
      <div className='w-full max-w-4xl flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16'>
        {/* Logo Section */}
        <div className='flex-shrink-0 text-center'>
          <div className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-4xl md:text-5xl lg:text-6xl">S</span>
          </div>
          <h1 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold">Synoro</h1>
          <p className="text-gray-400 text-lg md:text-xl mt-2">Connect. Chat. Collaborate.</p>
        </div>
        
        {/* Form Section */}
        <div className='w-full max-w-md'>
          <form 
            onSubmit={onSubmitHandler} 
            className='bg-gray-900 border border-gray-800 p-6 md:p-8 rounded-2xl shadow-2xl'
          >
            {/* Header */}
            <div className='flex justify-between items-center mb-6'>
              <h2 className='text-white font-semibold text-2xl md:text-3xl'>
                {currentState}
              </h2>
              {isDataSubmitted && (
                <button
                  type="button"
                  onClick={() => setIsDataSubmitted(false)}
                  className='p-2 hover:bg-gray-800 rounded-full transition-colors'
                >
                  <img src={assets.arrow_icon} alt="Back" className='w-5 h-5 filter invert' />
                </button>
              )}
            </div>

            {/* Form Fields */}
            <div className='space-y-4'>
              {currentState === "Sign up" && !isDataSubmitted && (
                <input 
                  onChange={(e) => setFullName(e.target.value)} 
                  value={fullName} 
                  type="text" 
                  className='w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all' 
                  placeholder='Full Name' 
                  required 
                />
              )}
              
              {!isDataSubmitted && (
                <>
                  <input 
                    onChange={(e) => setEmail(e.target.value)} 
                    value={email}
                    type="email" 
                    placeholder='Email Address' 
                    required 
                    className='w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'  
                  />
                  
                  <input 
                    onChange={(e) => setPassword(e.target.value)} 
                    value={password}
                    type="password" 
                    placeholder='Password' 
                    required 
                    className='w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'  
                  />
                </>
              )}

              {currentState === "Sign up" && isDataSubmitted && (
                <textarea 
                  onChange={(e) => setBio(e.target.value)} 
                  value={bio}
                  rows={4} 
                  className='w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none' 
                  placeholder='Tell us about yourself...' 
                  required
                />
              )}
            </div>
              
            {/* Submit Button */}
            <button 
              type='submit' 
              className='w-full py-3 mt-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent'
            >
              {currentState === "Sign up" ? "Create Account" : "Login Now"}
            </button>

            {/* Terms */}
            <div className='flex items-center gap-2 mt-4 text-sm text-gray-400'>
              <input type="checkbox" className='rounded' />
              <p>I agree to the terms of use & privacy policy</p>
            </div>

            {/* Switch Mode */}
            <div className='text-center mt-6'>
              {currentState === "Sign up" ? (
                <p className='text-sm text-gray-400'>
                  Already have an account? {' '}
                  <button
                    type="button"
                    onClick={() => {setCurrentState("Login"); setIsDataSubmitted(false)}} 
                    className='font-medium text-blue-400 hover:text-blue-300 transition-colors'
                  >
                    Login here
                  </button>
                </p>
              ) : (
                <p className='text-sm text-gray-400'>
                  Don't have an account? {' '}
                  <button
                    type="button"
                    onClick={() => setCurrentState("Sign up")} 
                    className='font-medium text-blue-400 hover:text-blue-300 transition-colors'
                  >
                    Sign up here
                  </button>
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
