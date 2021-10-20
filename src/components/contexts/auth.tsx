import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "../../services/api";

type User = {
    id: string;
    name: string;
    login: string;
    avatar_url: string;
}

type AuthContextData = {
    user: User | null; 
    signInUrl: string; 
    signOut: () => void;
}

type AuthResponse = {
    token: string;
    user: {
      id: string;
      name: string;
      avatar_url: string;
      login: string;
    }
}
  
export const AuthContext = createContext({} as AuthContextData);

type AuthProvider = {
    children: ReactNode;
}

export function Authprovider(props: AuthProvider) {
    const [user, setUser ] = useState<User | null>(null);

    const signInUrl = `https://github.com/login/oauth/authorize?scope=user&client_id=b40fee933f4cec2f48ea`;

    // função de login
    async function signIn(githubCode: string) {
       const response = await api.post<AuthResponse>('authenticate', {
         code: githubCode,
       })
  
       const { token, user } = response.data;
  
       localStorage.setItem('@doWhile:token', token);
       api.defaults.headers.common.authorization  = `Bearer ${token}`;

       
       setUser(user);
         
    }

    // função de logout
   function signOut() {
        setUser(null);
        // remove o token salvo no localStorage
        localStorage.removeItem('@doWhile:token');
    }
  
    useEffect(()  => {
  
      const url = window.location.href;
      const hasGithubCode = url.includes('?code=');
  
      if (hasGithubCode) {
         const [ urlWithoutCode, githubCode ] = url.split('?code=');
         
         window.history.pushState({}, '', urlWithoutCode);
         
         signIn(githubCode);
      }
  
    }, []);
    

    useEffect(() => {
        // pego o token salvo no localStorage
        const token = localStorage.getItem('@doWhile:token');

        if (token) {
            api.defaults.headers.common.authorization  = `Bearer ${token}`;

            api.get<User>('profile').then(response => {
               setUser(response.data);
            })
        }

    }, []);


    return (
        <AuthContext.Provider value={{ signInUrl, user, signOut }}>
         {props.children}
        </AuthContext.Provider>
    )
}