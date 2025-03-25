
// Mock authentication service since Firebase has been removed
// This file provides a simple interface that mimics Firebase auth

const auth = {
  currentUser: null,
  onAuthStateChanged: (callback) => {
    // Initially call with current state (null = not authenticated)
    callback(auth.currentUser);
    
    // Return an unsubscribe function
    return () => {};
  },
  signOut: async () => {
    auth.currentUser = null;
    return Promise.resolve();
  }
};

const googleProvider = {
  // Mock provider (not actually used but kept for interface compatibility)
};

// Export the mock auth objects
export { auth, googleProvider };
