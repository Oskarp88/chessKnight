import axios from "axios";
import { createContext, useState, useContext, useEffect } from "react";
import { baseUrl, getRequest } from "../utils/services";

const AuthContext = createContext(undefined);

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    token: ''
  });
  const [user, setUser] = useState(null);
  const [isScore, setScore] = useState(false);

  useEffect(()=>{
    
    const User = async() => {
      if(auth && auth.user) {
      const response = await getRequest(`${baseUrl}/user/${auth?.user?._id}`);
      if(response.error){
         return console.log('Error fetching users', response);
      }
       setUser(response);
      }
    }   
    User();
  },[auth, isScore]);

  // default axios
  axios.defaults.headers.common['Authorization'] = auth?.token;
  useEffect(() => {
    const data = localStorage.getItem('auth');
    if (data) {
      const parseData = JSON.parse(data);
      setAuth({
        ...auth,
        user: parseData.user,
        token: parseData.token
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth, user, isScore, setScore }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { useAuth, AuthProvider };
