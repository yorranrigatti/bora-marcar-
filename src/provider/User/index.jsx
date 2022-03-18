import { createContext, useContext, useEffect, useState } from "react";
import boraMarcarApi from "../../services/api";
import { useAuth } from "../Auth";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { userToken, userId } = useAuth();
  console.log(userId)
  const [user, setUser] = useState({});

  const getUserData = () => {
    boraMarcarApi
      .get(`/users/${userId}`)
      .then(({ data }) => {
        setUser(data);
      })
      .catch((error) => console.log(error));
  };

  const handleEditProfile = (data) => {
    boraMarcarApi
      .patch(`/users/${userId}`, data, {
        headers: { Authorization: `Bearer ${userToken}` },
      })
      .then(({ data }) => setUser(data))
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    if (userToken) {
      getUserData();
    }
  }, [userToken]);

  return (
    <UserContext.Provider value={{ user, handleEditProfile }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
