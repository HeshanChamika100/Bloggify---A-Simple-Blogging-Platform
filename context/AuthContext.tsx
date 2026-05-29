"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";

// Define the shape of user
interface User {
  id: string;
  name: string;
  email: string;
}

interface UpdateProfileInput {
  name: string;
  email: string;
  password?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (userData: User) => void;
  logout: () => void;
  updateProfile: (profileData: UpdateProfileInput) => Promise<User>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Validate token on mount
  useEffect(() => {
    const validateAuth = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
          credentials: "include"
        });
        
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          localStorage.setItem("user", JSON.stringify(data.user));
        } else {
          // Clear invalid auth data
          localStorage.removeItem("user");
          setUser(null);
        }
      } catch (error) {
        console.error("Auth validation failed", error);
        localStorage.removeItem("user");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    validateAuth();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const updateProfile = async (profileData: UpdateProfileInput) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/authors/profile`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(profileData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to update profile");
    }

    setUser(data.user);
    localStorage.setItem("user", JSON.stringify(data.user));

    return data.user;
  };

  const logout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, { 
        method: "POST",
        credentials: "include"
      });
      setUser(null);
      localStorage.removeItem("user");
      router.push("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context easily
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}