import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { database } from '../database'
import api from '../services/api';
import { User as ModelUser } from '../database/models/User'

interface User {
  id: string;
  user_id: string;
  email: string;
  name: string;
  driver_license: string;
  avatar: string;
  token: string;
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthProviderProps {
  children: ReactNode;
}

interface AuthContextData {
  user: User;
  signIn: (credentials: SignInCredentials) => Promise<void>
  signOut: () => Promise<void>;
  updateUser: (user: User) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

function AuthProvider({ children }: AuthProviderProps) {
  const [data, setData] = useState<User>({} as User);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUserData() {
      const userCollection = database.get<ModelUser>('users')
      const response = await userCollection.query().fetch();

      if (response.length > 0) {
        const userData = response[0]._raw as unknown as User;
        api.defaults.headers.authorization = `Bearer ${userData.token}`
        setData(userData);
        setLoading(false);
      }
    }

    loadUserData();
  }, [])

  async function signIn({ email, password }: SignInCredentials) {
    try {
      const response = await api.post('/sessions', {
        email, password
      })

      const { token, user } = response.data

      api.defaults.headers.authorization = `Bearer ${token}`

      const userCollection = database.get<ModelUser>('users')
      await database.write(async () => {
        await userCollection.create((newUser) => {
          newUser.user_id = user.id
          newUser.name = user.name
          newUser.email = user.email
          newUser.driver_license = user.driver_license
          newUser.avatar = user.avatar
          newUser.token = token
        })
      })

      setData({ token, ...user })
    } catch (error) {
      throw new Error(error);
    }
  }

  async function signOut() {
    try {
      const userCollection = database.get<ModelUser>('users');
      await database.write(async () => {
        const userSelected = await userCollection.find(data.id);
        await userSelected.destroyPermanently();
      });

      setData({} as User);
    } catch (error) {
      throw new Error(error);
    }
  }

  async function updateUser(user: User) {
    try {
      const userCollection = database.get<ModelUser>('users');

      await database.write(async () => {
        const userSelected = await userCollection.find(user.id);
        await userSelected.update(userUpdated => {
          userUpdated.name = user.name,
            userUpdated.driver_license = user.driver_license,
            userUpdated.avatar = user.avatar
        })
      })

      setData(user);
    } catch (error) {
      throw new Error(error);
    }
  }

  return (
    <AuthContext.Provider value={{ user: data, signIn, signOut, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

function useAuth() {
  const context = useContext(AuthContext)
  return context;
}

export { AuthProvider, useAuth }