import { createContext, useContext, useState } from "react";
import { signup as signupApi, getAllEntries , getCurrentUser  } from "../api/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {


  const [user, setUser] = useState(() => {
    const stored = sessionStorage.getItem("authCreds");
    return stored ? JSON.parse(stored) : null;
  });

  // const login = async (username, password) => {
  //   // Store creds first so the interceptor picks them up
  //   sessionStorage.setItem("authCreds", JSON.stringify({ username, password }));
  //   try {
  //     await getAllEntries(); // any authenticated endpoint works as a "verify" call
  //     setUser({ username, password });
  //     return { success: true };
  //   } catch (err) {
  //     sessionStorage.removeItem("authCreds");
  //     setUser(null);
  //     return { success: false, error: "Invalid username or password" };
  //   }
  // };


  const login = async (username, password) => {

  sessionStorage.setItem(
    "authCreds",
    JSON.stringify({ username, password })
  );

  try {
    const response = await getCurrentUser();

    const currentUser = response.data;

    setUser({
      username: currentUser.username,
      role: currentUser.role
    });

    return {
      success: true,
      role: currentUser.role
    };

  } catch (err) {

    sessionStorage.removeItem("authCreds");
    setUser(null);

    return {
      success: false,
      error: "Invalid username or password"
    };
  }
};

   

  const signup = async (username, password) => {
    try {
      await signupApi(username, password);
      return login(username, password); // auto-login after signup
    } catch (err) {
      return { success: false, error: err.response?.data?.message || "Signup failed" };
    }
  };

  const logout = () => {
    sessionStorage.removeItem("authCreds");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);