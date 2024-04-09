/*
* @license
* Copyright 2022 Google LLC
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";

const ADMINUSERS_COLLECTION = "adminUsers";
const USERS_COLLECTION = "users";

//NOTIFICATION
const NOTIFICATIONS_SUB_COLLECTION = "notifications";

export async function addNotification(userId, message, type = "info") {
  try {
    const notificationsRef = collection(
      db,
      USERS_COLLECTION,
      userId,
      NOTIFICATIONS_SUB_COLLECTION
    );

    const notificationData = {
      message,
      type,
      timestamp: new Date(),
    };

    const notificationRef = await addDoc(notificationsRef, notificationData);

    // Save the notification ID in the document data
    notificationData.notificationId = notificationRef.id;

    // Update the document with the notification ID
    await updateDoc(
      doc(
        db,
        USERS_COLLECTION,
        userId,
        NOTIFICATIONS_SUB_COLLECTION,
        notificationRef.id
      ),
      notificationData
    );

    return { success: true, id: notificationRef.id };
  } catch (error) {
    console.error("Error adding notification:", error);
    return { success: false, error: error.message };
  }
}

// Function to fetch all the notifications
export async function getNotifications() {
  try {
    const adminDashRef = collection(db, ADMINUSERS_COLLECTION);
    const notificationDashRef = doc(adminDashRef, "notifications");

    const loginNotificationsRef = collection(
      notificationDashRef,
      "loginNotifications"
    );
    const logoutNotificationsRef = collection(
      notificationDashRef,
      "logoutNotifications"
    );

    const closeChatNotificationsRef = collection(
      notificationDashRef,
      "chatNotifications"
    );

    const bondNotificationsRef = collection(
      notificationDashRef,
      "bondNotifications"
    );
    const iposNotificationsRef = collection(
      notificationDashRef,
      "iposNotifications"
    );
    const termsNotificationsRef = collection(
      notificationDashRef,
      "termsNotifications"
    );
    const stocksNotificationsRef = collection(
      notificationDashRef,
      "stocksNotifications"
    );

    const loginNotificationsSnapshot = await getDocs(
      query(loginNotificationsRef, orderBy("timeStamp", "desc"))
    );
    const logoutNotificationsSnapshot = await getDocs(
      query(logoutNotificationsRef, orderBy("timeStamp", "desc"))
    );

    const closeChatNotificationsSnapshot = await getDocs(
      query(closeChatNotificationsRef, orderBy("timeStamp", "desc"))
    );

    const bondNotificationsSnapshot = await getDocs(
      query(bondNotificationsRef, orderBy("timeStamp", "desc"))
    );
    const iposNotificationsSnapshot = await getDocs(
      query(iposNotificationsRef, orderBy("timeStamp", "desc"))
    );
    const termsNotificationsSnapshot = await getDocs(
      query(termsNotificationsRef, orderBy("timeStamp", "desc"))
    );
    const stocksNotificationsSnapshot = await getDocs(
      query(stocksNotificationsRef, orderBy("timeStamp", "desc"))
    );

    const loginNotifications = loginNotificationsSnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    const logoutNotifications = logoutNotificationsSnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    const closeChatNotifications = closeChatNotificationsSnapshot.docs.map(
      (doc) => ({
        ...doc.data(),
        id: doc.id,
      })
    );

    const bondNotifications = bondNotificationsSnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    const iposNotifications = iposNotificationsSnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    const termsNotifications = termsNotificationsSnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    const stocksNotifications = stocksNotificationsSnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    const allNotifications = [
      ...loginNotifications,
      ...logoutNotifications,
      ...closeChatNotifications,
      ...bondNotifications,
      ...iposNotifications,
      ...termsNotifications,
      ...stocksNotifications,
    ];

    const sortedNotifications = allNotifications.sort(
      (a, b) => b.timeStamp - a.timeStamp
    );
    return sortedNotifications;
  } catch (error) {
    console.error("Error in getting Notifications: ", error);
    return [];
  }
}

//sum up all notfications
export function sumNotifications(setNotifications) {
  const adminDashRef = collection(db, ADMINUSERS_COLLECTION);
  const notificationDashRef = doc(adminDashRef, "notifications");

  const loginNotificationsRef = collection(
    notificationDashRef,
    "loginNotifications"
  );
  const logoutNotificationsRef = collection(
    notificationDashRef,
    "logoutNotifications"
  );
  const closeChatNotificationsRef = collection(
    notificationDashRef,
    "chatNotifications"
  );
  const bondNotificationsRef = collection(
    notificationDashRef,
    "bondNotifications"
  );
  const iposNotificationsRef = collection(
    notificationDashRef,
    "iposNotifications"
  );
  const termsNotificationsRef = collection(
    notificationDashRef,
    "termsNotifications"
  );

  let loginNotificationsCount = 0;
  let logoutNotificationsCount = 0;
  let closeChatNotificationsCount = 0;
  let bondNotificationsCount = 0;
  let iposNotificationsCount = 0;
  let termsNotificationsCount = 0;

  const updateTotalNotifications = () => {
    let totalNotifications =
      loginNotificationsCount +
      logoutNotificationsCount +
      closeChatNotificationsCount +
      bondNotificationsCount +
      iposNotificationsCount +
      termsNotificationsCount;
    setNotifications(totalNotifications);
  };

  // Listen to changes in the loginNotifications collection
  onSnapshot(loginNotificationsRef, (querySnapshot) => {
    loginNotificationsCount = querySnapshot.size;
    updateTotalNotifications();
  });

  // Listen to changes in the logoutNotifications collection
  onSnapshot(logoutNotificationsRef, (querySnapshot) => {
    logoutNotificationsCount = querySnapshot.size;
    updateTotalNotifications();
  });

  // Listen to changes in the closeChatNotifications collection
  onSnapshot(closeChatNotificationsRef, (querySnapshot) => {
    closeChatNotificationsCount = querySnapshot.size;
    updateTotalNotifications();
  });

  onSnapshot(bondNotificationsRef, (querySnapshot) => {
    bondNotificationsCount = querySnapshot.size;
    updateTotalNotifications();
  });
  onSnapshot(iposNotificationsRef, (querySnapshot) => {
    iposNotificationsCount = querySnapshot.size;
    updateTotalNotifications();
  });
  onSnapshot(termsNotificationsRef, (querySnapshot) => {
    termsNotificationsCount = querySnapshot.size;
    updateTotalNotifications();
  });
}

// Function to delete all notifications
export async function deleteAllNotifications() {
  const adminDashRef = collection(db,ADMINUSERS_COLLECTION);
  const notificationDashRef = doc(adminDashRef, NOTIFICATIONS_SUB_COLLECTION);

  const loginNotificationsRef = collection(
    notificationDashRef,
    "loginNotifications"
  );
  const logoutNotificationsRef = collection(
    notificationDashRef,
    "logoutNotifications"
  );
  const chatNotificationsRef = collection(
    notificationDashRef,
    "chatNotifications"
  );
  const bondNotificationsRef = collection(
    notificationDashRef,
    "bondNotifications"
  );
  const iposNotificationsRef = collection(
    notificationDashRef,
    "iposNotifications"
  );
  const termsNotificationsRef = collection(
    notificationDashRef,
    "termsNotifications"
  );

  const deleteCollection = async (collectionRef) => {
    const querySnapshot = await getDocs(collectionRef);
    querySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
  };

  try {
    await deleteCollection(loginNotificationsRef);
    await deleteCollection(logoutNotificationsRef);
    await deleteCollection(chatNotificationsRef);
    await deleteCollection(bondNotificationsRef);
    await deleteCollection(iposNotificationsRef);
    await deleteCollection(termsNotificationsRef);

    console.log("All notifications deleted successfully");
  } catch (error) {
    console.error("Error deleting notifications:", error);
  }
}

export async function deleteNotification(id) {
  const adminUsersRef = collection(db, ADMINUSERS_COLLECTION);
  const notificationsRef = doc(adminUsersRef, NOTIFICATIONS_SUB_COLLECTION);

  const subcollectionRefs = [
    collection(notificationsRef, "loginNotifications"),
    collection(notificationsRef, "logoutNotifications"),
    collection(notificationsRef, "chatNotifications"),
    collection(notificationsRef, "bondNotifications"),
    collection(notificationsRef, "iposNotifications"),
    collection(notificationsRef, "termsNotifications"),
  ];

  try {
    // Iterate through each subcollection
    for (const subcollectionRef of subcollectionRefs) {
      // Get all documents in the current subcollection
      const documentsSnapshot = await getDocs(subcollectionRef);

      // Iterate through each document in the subcollection
      for (const document of documentsSnapshot.docs) {
        // Check if the document ID matches the provided ID
        if (document.id === id) {
          // Delete the document
          await deleteDoc(document.ref);
          return;
        }
      }
    }

  } catch (error) {
    console.error("Error deleting document:", error);
    throw error;
  }
}