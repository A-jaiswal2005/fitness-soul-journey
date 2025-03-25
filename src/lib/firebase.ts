
// Empty auth service - no actual authentication required
const auth = {
  currentUser: { email: 'user@example.com' }, // Always return a mock user
  onAuthStateChanged: (callback) => {
    // Always call with a mock user (always authenticated)
    callback(auth.currentUser);
    return () => {};
  },
  signOut: async () => {
    return Promise.resolve();
  }
};

const googleProvider = {};

export { auth, googleProvider };
