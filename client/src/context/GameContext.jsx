import { createContext, useCallback, useEffect, useState } from "react";
import { getRequest, baseUrl, postRequest } from "../utils/services";
import  io  from 'socket.io-client';

export const GameContext = createContext();

export const GameContextProvider = ({children, user}) => {

    useEffect(() => {
        const newSocket = io.connect('http://localhost:8080');
        setSocket(newSocket);

        return () =>{
         newSocket.disconnect();
        }
    },[user]);
    return (
        <GameContext.Provider
         
        >
            {children}
        </GameContext.Provider>
    )
}