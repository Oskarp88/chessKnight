import { useEffect, useState } from "react";
import "./App.css";
import Chessboard from "./components/Chessboard";
import NavBar from "./components/navbar/NavBar";
import { ChessboardProvider } from "./context/boardContext";
import { CheckMateProvider } from "./context/checkMateContext";
import { BrowserRouter as Router, Route, Routes, useNavigate} from "react-router-dom";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import ForgotPassword from "./pages/ForgotPassewor";
import ResetPassword from "./pages/ResetPassword";
import { PieceProvider } from "./context/pieceContext";
import { ChatContextProvider } from "./context/ChatContext";
import { useAuth } from "./context/authContext";
import Chats from "./pages/Chats";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'normalize.css';
import PrivateRoute from "./components/routes/PrivateRoute";
import UserProfile from "./pages/user/UserProfile";
import Channel from "./components/channel/Channel";
import { SocketProvider } from "./context/socketContext";
import { Toaster } from 'react-hot-toast';
import Register from "./pages/user/Register";
import { LanguagesProvider } from "./context/languagesContext";
import Sidebar from "./components/navbar/sidebar";
import NotFound from "./pages/PageNotFound";
import { GameContextProvider } from "./context/gameContext";
import 'animate.css';
import { Home } from "./pages/home/Home";

function App() {
  const {auth} = useAuth();
 
  return (
    
  <SocketProvider user={auth.user}>
   <ChatContextProvider user={auth.user}>
     <PieceProvider>
       <LanguagesProvider>
       <CheckMateProvider >
         <ChessboardProvider user={auth.user}>  
         <GameContextProvider user={auth.user}>      
            <div id="app">
              <Router>
                <NavBar/>
                <Sidebar/>                
              <Routes>                          
                <Route path="/" element={<Home/>}/>
                <Route path="*" element={<NotFound/>}/>
                <Route path="/login" element={<Login/>} />
                <Route path="/register" element={<Registro/>} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword/>} />
                <Route path="chess" element={<Chessboard/>} />
                <Route path='/dashboard' element={<PrivateRoute/>}>
                    <Route path='profile' element={<UserProfile/>}/> 
                    <Route path='next' element={<Register/>}/>                    
                </Route> 
                <Route path='/auth' element={<PrivateRoute/>}>
                    <Route path="chat" element={<Chats/>}/>
                    <Route path="channel" element={<Channel/>} />
                </Route>                     
              </Routes>
              </Router>
              <Toaster />  
            </div>
            </GameContextProvider>
         </ChessboardProvider>
       </CheckMateProvider>
       </LanguagesProvider>
    </PieceProvider>
   </ChatContextProvider>
   </SocketProvider>
   
  );
}

export default App;