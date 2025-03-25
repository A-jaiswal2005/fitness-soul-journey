
// This file is now deprecated as we're using Supabase authentication
// It's kept for backward compatibility with any existing code

const auth = {
  currentUser: null,
  onAuthStateChanged: (callback) => {
    console.warn('Using deprecated firebase.ts - switch to useAuth() from AuthContext');
    // Return empty function for unsubscribe
    return () => {};
  },
  signOut: async () => {
    console.warn('Using deprecated firebase.ts - switch to useAuth() from AuthContext');
    return Promise.resolve();
  }
};

const googleProvider = {};

export { auth, googleProvider };
