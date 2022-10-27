import { getAuth, onAuthStateChanged } from 'firebase/auth';

export const auth = getAuth();

onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      const uid = user.uid;
      // ...
    } else {
      // User is signed out
      // ...
    }
  });

  // reset password: auth.sendPasswordResetEmail(email)
  // add phone number auth.user.linkWithPhoneNumber(number, applicationVerifier)