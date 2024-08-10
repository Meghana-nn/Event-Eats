import React, {createContext, useContext, useState} from 'react'
const AuthContext = createContext()

export const useAuth = () =>{
    return useContext(AuthContext)
}
export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null)

    const handleLogin = (user) => {
        localStorage.setItem('userId',user._id)
        setUser(user)
        
    }
    const handleLogout = () => {
        setUser(null)
        localStorage.removeItem('token');
        sessionStorage.removeItem('catererId')
        
       
}

    return ( 
        <AuthContext.Provider value={{ user, handleLogin, handleLogout }}>
            { children }
        </AuthContext.Provider>
    )
}
