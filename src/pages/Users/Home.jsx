import Axios from "../../api/shared/instance";
import { useNavigate } from 'react-router-dom';
import { resetUserState } from '../../redux/slices/userSlice';
import { useLayoutEffect } from "react";
import { useDispatch } from "react-redux";

const Home = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fetchUserData = async () => {
    try {
      const userId = localStorage.getItem('userData');
  
      if (!userId) {
        navigate('/login');
        return;
      }
  
      const response = await Axios.get(`/api/user/get/${userId}`);

    } catch (error) {
      if (error && error.response.data.message === "You are blocked") {
        localStorage.removeItem('userData');
        localStorage.removeItem('userAccessToken');
        dispatch(resetUserState());
        console.log("Your account is blocked");
        navigate("/login");
      }
    }
  };

  useLayoutEffect(() => {

    fetchUserData();

  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight text-gray-900">User Home</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Replace with your dashboard content */}
          <div className="px-4 py-8 bg-white shadow sm:rounded-lg">
            <p className="text-lg text-gray-700">Welcome to the User Home! Here, you can manage your website or application.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;