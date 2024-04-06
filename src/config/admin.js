import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    onSnapshot,
    setDoc,
    updateDoc,
  } from "firebase/firestore";
  import { db } from "./firebase";
  import {
    createUserWithEmailAndPassword,
    getAuth,
    sendEmailVerification,
    sendPasswordResetEmail,
    signOut,
  } from "firebase/auth";
  
  const ADMINUSERS_COLLECTION = "adminUsers";
 //Admin Users
 export function addAdminUser(uid, fullName, email) {
    return db.collection('adminUsers').doc(uid).set({
      fullName,
      email,
      role: 'admin',
    });
  }

  export async function fetchAdmins() {
    try {
      const adminsSnapshot = await db.collection('adminUsers').get();
      const admins = [];
  
      adminsSnapshot.forEach((doc) => {
        const data = doc.data();
        admins.push({
          uid: doc.id,
          name: data.fullName,
          role: data.role,
        });
      });
  
      return admins;
    } catch (error) {
      console.error('Error fetching admins:', error);
      throw error;
    }
  }
  
  export const checkAdminRoleAndLogoutIfNot = async (db) => {
    const auth = getAuth();
    const user = auth.currentUser;
  
    if (!user) {
      return false;
    }
  
    try {
      const adminUserRef = doc(db, ADMINUSERS_COLLECTION, user.uid);
      const adminUserDoc = await getDoc(adminUserRef);
  
      if (adminUserDoc.exists() && adminUserDoc.data().role === "admin") {
        return true;
      } else {
        await signOut(auth);
        return false;
      }
    } catch (error) {
      console.error("Error checking admin role:", error);
      await signOut(auth);
      return false;
    }
  };
  