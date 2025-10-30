import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";
import { AuthContext } from "../../context/AuthContext";

const ProfilePage = () => {
  const {authUser, updateProfile} = useContext(AuthContext)
  const [selectedImg, setSelectedImg] = useState(null);
  const navigate = useNavigate();
  const [name, setName] = useState(authUser?.fullName || "");
  const [bio, setBio] = useState(authUser?.bio || "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!selectedImg){
      await updateProfile({fullName: name, bio})
      navigate('/')
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(selectedImg);
    reader.onload = async () => {
      const base64Image = reader.result;
      await updateProfile({profilePic: base64Image, fullName: name, bio})
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-black">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/')}
            className="p-2 text-white hover:bg-gray-800 rounded-full transition-colors"
          >
            <img src={assets.arrow_icon} alt="Back" className="w-5 h-5 rotate-180 filter invert" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <h1 className="text-white text-2xl font-semibold">Synoro Profile</h1>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Profile Image Section */}
            <div className="lg:w-1/3 p-6 lg:p-8 flex flex-col items-center justify-center bg-gradient-to-br from-blue-500/10 to-purple-500/10">
              <div className="relative mb-4">
                <img
                  src={
                    selectedImg
                      ? URL.createObjectURL(selectedImg)
                      : authUser?.profilePic || assets.avatar_icon
                  }
                  alt="Profile"
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white/20"
                />
                <label
                  htmlFor="avatar"
                  className="absolute bottom-2 right-2 bg-blue-500 hover:bg-blue-600 p-2 rounded-full cursor-pointer transition-colors"
                >
                  <img src={assets.gallery_icon} alt="Upload" className="w-4 h-4 filter invert" />
                  <input
                    onChange={(e) => setSelectedImg(e.target.files[0])}
                    type="file"
                    id="avatar"
                    accept="image/*"
                    hidden
                  />
                </label>
              </div>
              <p className="text-gray-300 text-sm text-center">
                Click the camera icon to change your profile picture
              </p>
            </div>

            {/* Form Section */}
            <div className="lg:w-2/3 p-6 lg:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Full Name
                  </label>
                  <input
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    type="text"
                    required
                    placeholder="Enter your full name"
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Bio
                  </label>
                  <textarea
                    onChange={(e) => setBio(e.target.value)}
                    value={bio}
                    placeholder="Tell us about yourself..."
                    required
                    rows={4}
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="flex-1 py-3 px-6 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
