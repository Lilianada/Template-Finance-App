import {
    doc,
    getDoc,
  } from "firebase/firestore";
  import {
    getAuth,
    signOut,
  } from "firebase/auth";
  import { format, isToday, isYesterday } from "date-fns";
  
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
  
  
 export const convertDateToISO = (dateStr) => {
    const [day, month, year] = dateStr.split("-");
    return `${year}-${month}-${day}`;
  };

  export function convertToNumber(stringAmount) {
    // Check if the input is already a number, and if not, convert it
    if (typeof stringAmount === "string") {
      return parseFloat(stringAmount.replace(",", ""));
    } else if (typeof stringAmount === "number") {
      return stringAmount;
    }
    return 0;
  }

  
  export  const formatTimestamp = (timeStamp) => {
    if (!timeStamp) return "";

    const date = timeStamp.toDate(); // Convert Firestore timestamp to JavaScript Date object

    if (isToday(date)) {
      // If the message was sent today, return only the time
      return format(date, "p"); // 'p' is for the local time format
    } else if (isYesterday(date)) {
      // If the message was sent yesterday, return 'Yesterday'
      return "Yesterday";
    } else {
      // Otherwise, return the full date
      return format(date, "PPP"); // 'PPP' is for the longer date format, e.g., Jun 20, 2020
    }
  };