import {
    doc,
    getDoc,
  } from "firebase/firestore";
  import {
    getAuth,
    signOut,
  } from "firebase/auth";
  
  const ADMINUSERS_COLLECTION = "adminUsers";
  
  //Get Current Date
  export function getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0"); // Month is zero-based
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  
  //Format Number
  export function formatNumber(number) {
    return new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(number);
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
  
  
  
