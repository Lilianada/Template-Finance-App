import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  getAuth,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import { getFunctions, httpsCallable } from "firebase/functions";

const ADMINUSERS_COLLECTION = "adminUsers";

export async function addAdminUser(fullName, email, password) {
  try {
    const auth = getAuth();

    // Create admin user in Firebase Authentication
    const adminCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const adminUid = adminCredential.user.uid;

    // Send password reset email
    await sendPasswordResetEmail(auth, email);

    // Add admin to Firestore
    const newAdmin = {
      uid: adminUid,
      fullName,
      email,
      role: "admin",
    };
    const adminDocRef = doc(db, ADMINUSERS_COLLECTION, adminUid);
    await setDoc(adminDocRef, newAdmin);

    return newAdmin;
  } catch (error) {
    console.error("Error adding admin user:", error);
    throw error;
  }
}

export async function deleteAdminUser(uid) {
  try {
    const functionsInstance = getFunctions();
    const deleteFunction = httpsCallable(
      functionsInstance,
      "deleteUserAccount"
    );

    await deleteFunction({ userId: uid });

    // Delete admin user document from Firestore
    await deleteDoc(doc(db, "adminUsers", uid));

    return "Admin user successfully deleted.";
  } catch (error) {
    console.error("Error deleting admin user:", error);
    throw error;
  }
}

export async function fetchAdmins() {
  try {
    const adminUserCollection = collection(db, "adminUsers"); // Assuming 'adminUsers' is your Firestore collection name
    const adminsQuery = query(
      adminUserCollection,
      where("role", "==", "admin")
    );
    const adminsSnapshot = await getDocs(adminsQuery);

    const admins = [];
    adminsSnapshot.forEach((doc) => {
      const data = doc.data();
      admins.push({
        uid: doc.id,
        name: data.fullName,
        role: data.role,
        email: data.email,
      });
    });

    return admins;
  } catch (error) {
    console.error("Error fetching admins:", error);
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


// Function to add login/logout notification to Admin Dashboard
export async function addLogNotification(userRef) {
  try {
    // Fetch the user's data to determine the login status
    const userSnapshot = await getDoc(userRef);

    if (userSnapshot.exists()) {
      const userData = userSnapshot.data();
      const isLoggedIn = userData.isLoggedIn; // Assuming 'isLoggedIn' is a boolean field in the user's data

      // Create a notification message based on the login status
      const adminNotification = isLoggedIn
        ? `User '${userData.fullName}' logged in`
        : `User '${userData.fullName}' logged out`;

      // Send the notification to the admin_users collection
      const notificationData = {
        message: adminNotification,
        // date: getCurrentDate(),
        timeStamp: new Date(),
        isLoggedIn: isLoggedIn,
      };

      // Construct the Firestore references for admin dashboard and sub-collection
      const adminDashRef = collection(db, ADMINUSERS_COLLECTION);
      const notificationDashRef = doc(adminDashRef, "notifications");
      const subCollectionName = isLoggedIn
        ? "loginNotifications"
        : "logoutNotifications";
      const notificationsRef = collection(
        notificationDashRef,
        subCollectionName
      );

      await addDoc(notificationsRef, notificationData);
      return notificationData;
    } else {
      console.error("User not found in Firestore.");
      return null;
    }
  } catch (error) {
    console.error("Error adding user login notification to Firestore:", error);
    return null;
  }
}