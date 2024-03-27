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
    query,
    setDoc,
    updateDoc,
  } from "firebase/firestore";
  import { db } from "./firebase";
import { getCurrentDate } from "./utils";

  const ADMINDASH_COLLECTION = "admin_users";
  const USERS_COLLECTION = "users";
  
  //IPOS
  const IPOS_COLLECTION = "ipos";
  
//Get Users Ipos
export async function getUserIpos(uid) {
  const iposQuery = query(
    collection(db, USERS_COLLECTION, uid, IPOS_COLLECTION)
    // orderBy("date")
  );
  const querySnapshot = await getDocs(iposQuery);

  if (querySnapshot.empty) {
    return null; // Return null if no ipos are found
  }

  return querySnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));
}

  // 1.Get all IPOs
  export const getAllIpos = async () => {
    const iposQuery = query(
      collection(db, IPOS_COLLECTION)
      // orderBy("date")
    );
    const querySnapshot = await getDocs(iposQuery);
  
    if (querySnapshot.empty) {
      return null; // Return null if no ipos are found
    }
  
    return querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
  };
  
  // 2.Update
  export const updateIpo = async (ipoId, updatedData) => {
    try {
      const ipoRef = doc(db, IPOS_COLLECTION, ipoId);
      await updateDoc(ipoRef, updatedData);
    } catch (error) {
      console.error("Error updating IPO: ", error);
      throw error;
    }
  };
  
  // 3.Add New
  export const addNewIpos = async (ipoData) => {
    try {
      const iposCollectionRef = collection(db, IPOS_COLLECTION);
      const docRef = await addDoc(iposCollectionRef, ipoData);
      return docRef.id;
    } catch (error) {
      console.error("Error adding IPO: ", error);
      throw error;
    }
  };
  
  // 4.Delete
  export const deleteIpos = async (ipoId) => {
    const ipoRef = doc(db, IPOS_COLLECTION, ipoId);
    try {
      await deleteDoc(ipoRef);
    } catch (error) {
      console.error("Error deleting IPO: ", error);
      throw error;
    }
  };
  
  //IPOrequest
  const IPOS_REQUESTS_COLLECTION = "ipoInvestmentRequests";
  
  // 1. Add IPO details to a sub-collection in the user's document
  export const addIposToUserCollection = async (userId, ipoData) => {
    try {
      const userIposHoldingsPath = collection(db, `users/${userId}/ipos`);
      const docRef = await addDoc(userIposHoldingsPath, ipoData);
      const docId = docRef.id;
  
      return { success: true, id: docId };
    } catch (error) {
      console.error("Error adding term:", error);
      return { success: false, error: error.message };
    }
  };
  
  // 2. Add IPO details to a sub-collection in the user's document
  export const updateIposToUserCollection = async (userId, ipoId, ipoData) => {
    try {
      const userIposHoldingsPath = collection(
        db,
        `users/${userId}/ipos` // Reference to the subcollection
      );
  
      const docRef = doc(userIposHoldingsPath, ipoId); // Reference to the specific document within the subcollection
      await updateDoc(docRef, ipoData);
      const docId = docRef.id;
  
      return { success: true, id: docId };
    } catch (error) {
      console.error("Error updating ipos:", error);
      return { success: false, error: error.message };
    }
  };
  
  // 3. Delete IPO from user's ipos sub-collection
  export const deleteUserIpo = async (uid, requestId) => {
    const requestRef = doc(db, USERS_COLLECTION, uid, IPOS_COLLECTION, requestId);
    await deleteDoc(requestRef);
  };
  
  // 3. Delete the IPO request status from the user's request collection
  export const deleteIposRequestStatus = async (uid, requestId) => {
    const requestRef = doc(
      db,
      ADMINDASH_COLLECTION,
      uid,
      IPOS_REQUESTS_COLLECTION,
      requestId
    );
    await deleteDoc(requestRef);
  };
  
  // 4. Fetch all the IPO requests
  export async function getIposRequests() {
    try {
      const adminDashRef = collection(db, ADMINDASH_COLLECTION);
      const adminDashSnapshot = await getDocs(adminDashRef);
  
      if (adminDashSnapshot.empty) {
        console.warn("No documents found in admin users collection");
        return [];
      }
  
      let allIposRequests = [];
  
      for (const adminDoc of adminDashSnapshot.docs) {
        const userId = adminDoc.id;
        const iposRequestsRef = collection(
          db,
          ADMINDASH_COLLECTION,
          userId,
          IPOS_REQUESTS_COLLECTION
        );
        const iposRequestsSnapshot = await getDocs(iposRequestsRef);
  
        if (iposRequestsSnapshot.empty) continue;
  
        const userIposRequests = iposRequestsSnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
          userId: userId,
        }));
  
        allIposRequests = [...allIposRequests, ...userIposRequests];
      }
  
      return allIposRequests;
    } catch (error) {
      console.error("Error in getIposRequests: ", error);
      return [];
    }
  }
  
  //Sum of ipos requests
  export function sumIposRequests(db, setIposRequestsCount) {
    const adminDashRef = collection(db, ADMINDASH_COLLECTION);
    let totalIposRequestsCount = 0;
    let activeListeners = 0;
  
    onSnapshot(adminDashRef, (adminDocs) => {
      totalIposRequestsCount = 0;
      activeListeners = adminDocs.size;
  
      if (activeListeners === 0) {
        setIposRequestsCount(0); // If no admin docs, set count to 0
      }
      adminDocs.forEach((doc) => {
        try {
          const iposRequestsRef = collection(
            db,
            ADMINDASH_COLLECTION,
            doc.id,
            IPOS_REQUESTS_COLLECTION,
          );
  
          onSnapshot(iposRequestsRef, (iposRequestsSnapshot) => {
            totalIposRequestsCount += iposRequestsSnapshot.size;
  
            activeListeners -= 1;
            if (activeListeners === 0) {
              setIposRequestsCount(totalIposRequestsCount); // Update count when all listeners reported
            }
          });
        } catch (error) {
          console.error("Error in sumsumming requests ", error);
        }
      });
    });
  }
  
  // 5. Handle the IPO approval logic
  export const handleIpoApproval = async (uid, requestId, requestData) => {
    try {
      if (!requestId || requestData.numberOfShares === undefined) {
        console.error("Invalid requestId:", requestId);
        return;
      }
  
      // Reference to the user's "ipos" subcollection
      const userIposPath = collection(db, USERS_COLLECTION, uid, IPOS_COLLECTION);
  
      // Reference to the specific "ipos" document within the subcollection
      const iposDocRef = doc(userIposPath, requestId);
  
      // Check if the user's "ipos" subcollection exists, and if not, create it
      await setDoc(iposDocRef, { ...requestData, status: "Approved" });
  
      // Add Notification
      const userNotificationPath = collection(
        db,
        USERS_COLLECTION,
        uid,
        'notifications'
      );
  
      await addDoc(userNotificationPath, {
        message: "Your IPO request has been approved.",
        type: "Approved",
      });
    } catch (error) {
      console.error("Error in Approval:", error);
    }
  };
  
  // 6. Handle the IPO decline logic
  export const handleIpoDecline = async (uid, requestId) => {
    try {
      if (!requestId) {
        console.error("Invalid requestId:", requestId);
        return;
      }
  
      // Reference to the IPO request document
      const requestRef = doc(db, ADMINDASH_COLLECTION, uid, IPOS_REQUESTS_COLLECTION, requestId);
  
      if (!requestRef) {
        throw new Error("Request reference is undefined");
      }
  
      // Correctly reference the user's notifications sub-collection
      const userNotificationRef = collection(db, USERS_COLLECTION, uid, 'notifications');
      
      // Add a notification to the sub-collection
      await addDoc(userNotificationRef, {
        message: "Your IPO request has been declined.",
        timestamp: getCurrentDate(),
        type: "Decline",
      });
  
      // Delete the IPO request document
      await deleteDoc(requestRef);
  
    } catch (error) {
      console.error("Error in Decline:", error);
    }
  };
  
  export const getSpecificIpoRequest = async (requestId, uid) => {
    const requestRef = doc(
      db,
      ADMINDASH_COLLECTION,
      uid,
      IPOS_REQUESTS_COLLECTION,
      requestId
    );
    const requestSnapshot = await getDoc(requestRef);
    return requestSnapshot.data();
  };
  