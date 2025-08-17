import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { firebaseAuth } from '../services/firebase';

/**
 * Signs in a user with email and password.
 */
export const signInWithEmail = (email: string, password: string): Promise<FirebaseAuthTypes.UserCredential> => {
  return firebaseAuth.signInWithEmailAndPassword(email, password);
};

/**
 * Creates a new user account.
 */
export const registerWithEmail = (email: string, password: string): Promise<FirebaseAuthTypes.UserCredential> => {
  return firebaseAuth.createUserWithEmailAndPassword(email, password);
};

/**
 * Sends a password reset email.
 */
export const sendPasswordResetEmail = (email: string): Promise<void> => {
  return firebaseAuth.sendPasswordResetEmail(email);
};

/**
 * Signs out the current user.
 */
export const signOut = (): Promise<void> => {
  return firebaseAuth.signOut();
};
