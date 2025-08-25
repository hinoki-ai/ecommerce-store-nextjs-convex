// Authentication bypass for testing
// This file provides auth bypass when SKIP_AUTH=true

import { mockUser } from './mock-data';

export const isAuthSkipped = () => {
  return process.env.SKIP_AUTH === "true" || process.env.NEXT_PUBLIC_SKIP_AUTH === "true";
};

export const mockAuth = {
  user: mockUser,
  isAuthenticated: true,
  isSignedIn: true,
  isLoaded: true,
  signIn: () => Promise.resolve(mockUser),
  signOut: () => Promise.resolve(),
  signUp: () => Promise.resolve(mockUser),
};

// Mock Clerk hooks
export const useMockAuth = () => {
  if (!isAuthSkipped()) {
    throw new Error("Mock auth should only be used when SKIP_AUTH=true");
  }
  
  return {
    user: mockUser,
    isSignedIn: true,
    isLoaded: true,
    signOut: async () => {
      console.log("Mock: Sign out");
    }
  };
};

// Mock Clerk components
export const MockSignInButton = ({ children, ...props }: any) => {
  if (!isAuthSkipped()) return null;
  
  return (
    <button 
      onClick={() => console.log("Mock: Sign in clicked")}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      {...props}
    >
      {children || "Iniciar Sesión (Mock)"}
    </button>
  );
};

export const MockSignOutButton = ({ children, ...props }: any) => {
  if (!isAuthSkipped()) return null;
  
  return (
    <button
      onClick={() => console.log("Mock: Sign out clicked")}
      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      {...props}
    >
      {children || "Cerrar Sesión (Mock)"}
    </button>
  );
};

export const MockUserButton = ({ ...props }) => {
  if (!isAuthSkipped()) return null;
  
  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded">
      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">
        {mockUser.firstName[0]}
      </div>
      <span className="text-sm text-gray-700">{mockUser.fullName}</span>
    </div>
  );
};