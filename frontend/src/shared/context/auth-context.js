import { createContext } from "react";

export const AuthContext = createContext({
    userID : null,
    isLoggedIn:false,
    logging: ()=>{},
    logout:()=>{}
})