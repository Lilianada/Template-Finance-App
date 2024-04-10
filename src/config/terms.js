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

const ADMINDASH_COLLECTION = "admin_users";
const USERS_COLLECTION = "users";

//TERMS
const TERMS_COLLECTION = "fixedTermDeposit";
const FIXED_TERMS_SUB_COLLECTION = "fixedTermDeposits";

export async function getUserFixedTerm(uid) {
  const fixedTermQuery = query(
    collection(db, USERS_COLLECTION, uid, FIXED_TERMS_SUB_COLLECTION)
    // orderBy("date")
  );
  const querySnapshot = await getDocs(fixedTermQuery);

  if (querySnapshot.empty) {
    return null; // Return null if no fixedTerm are found
  }

  return querySnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));
}

//get all terms
export async function getAllTerms() {
  // Get a reference to the 'terms' collection
  const termsRef = collection(db, TERMS_COLLECTION);
  const termsSnapshot = await getDocs(termsRef);

  const allTerms = termsSnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));
  // If there are no terms at all, return null
  if (allTerms.length === 0) {
    return null;
  }

  return allTerms;
}

//add new terms
export async function addNewTerm(termData) {
  try {
    const termsRef = collection(db, TERMS_COLLECTION);
    const newTermRef = await addDoc(termsRef, termData);
    return { success: true, id: newTermRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

//update existing term
export async function updateTerm(termId, updatedData) {
  try {
    const termRef = doc(db, TERMS_COLLECTION, termId);
    await updateDoc(termRef, updatedData);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

//delete
export async function deleteTerm(termId) {
  try {
    const termRef = doc(db, TERMS_COLLECTION, termId);
    await deleteDoc(termRef);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

//TERMS REQUEST
const TERMS_REQUEST_SUB_COLLECTION = "termDepositRequest";

// 1.Function to fetch all the term requests
export async function getTermRequests() {
  try {
    const adminDashRef = collection(db, ADMINDASH_COLLECTION);
    const adminDashSnapshot = await getDocs(adminDashRef);

    if (adminDashSnapshot.empty) {
      console.warn("No documents found in admin users collection");
      return [];
    }

    let allTermRequests = [];

    for (const adminDoc of adminDashSnapshot.docs) {
      const userId = adminDoc.id;
      const termRequestsRef = collection(
        db,
        ADMINDASH_COLLECTION,
        userId,
        TERMS_REQUEST_SUB_COLLECTION
      );
      const termRequestsSnapshot = await getDocs(termRequestsRef);

      if (termRequestsSnapshot.empty) continue;

      const userTermRequests = termRequestsSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        userId: userId,
      }));

      allTermRequests = [...allTermRequests, ...userTermRequests];
    }

    return allTermRequests;
  } catch (error) {
    console.error("Error in getTermRequests: ", error);
    return [];
  }
}

//Sum of fixed term requests
export async function sumTermRequests(db, setTermsRequests) {
  const adminDashRef = collection(db, ADMINDASH_COLLECTION);
  let termRequestsCount = 0;
  let activeListeners = 0;

  onSnapshot(adminDashRef, (adminDocs) => {
    termRequestsCount = 0; // Reset count for each update
    activeListeners = adminDocs.size;

    if (activeListeners === 0) {
      setTermsRequests(0); // If no admin docs, set count to 0
    }

    adminDocs.forEach((doc) => {
      try {
        const termsRequestsRef = collection(
          db,
          ADMINDASH_COLLECTION,
          doc.id,
          TERMS_REQUEST_SUB_COLLECTION
        );

        onSnapshot(termsRequestsRef, (termsRequestsSnapshot) => {
          termRequestsCount += termsRequestsSnapshot.size;

          activeListeners -= 1;
          if (activeListeners === 0) {
            setTermsRequests(termRequestsCount); // Update count when all listeners reported
          }
        });
      } catch (error) {
        console.error("Error in summing requests", error);
      }
    });
  });
}

// 2.Function to handle withdraw terms
export async function handleWithdrawalApproval(uid, termData) {
  const userTermsPath = `users/${uid}/fixedTermDeposits`;
  const termDocRef = doc(db, `${userTermsPath}/${termData.id}`); // Assuming termData.id is unique for each term

  const termDoc = await getDoc(termDocRef);

  if (termDoc.exists()) {
    await deleteDoc(termDocRef);
  } else {
    console.error("Term does not exist in user's fixed term deposit");
  }
}

// 3.Function to handle deposit terms
export async function handleDepositApproval(uid, termData) {
  try {
    // Check if termData and its id are defined
    if (!termData || !termData.id || termData.principalAmount === undefined) {
      console.error("Invalid termData:", termData);
      return;
    }

    const userTermsPath = `users/${uid}/fixedTermDeposits`;
    const termDocRef = doc(db, `${userTermsPath}/${termData.id}`);
    const termDoc = await getDoc(termDocRef);

    // If termDoc doesn't exist, then this is the first document in the fixedTermDeposits collection
    if (!termDoc.exists()) {
      await setDoc(termDocRef, { ...termData });
      return;
    }
    await updateDoc(termDocRef, { amount: termData.amount });
  } catch (error) {
    console.error("Error in handleDepositApproval:", error);
  }
}

// 4.Function to update fixed term request status in the Firestore
export async function updateFixedTermRequestStatus(
  userId,
  requestId,
  newStatus
) {
  const requestDocPath = doc(
    db,
    `${ADMINDASH_COLLECTION}/${userId}/${TERMS_REQUEST_SUB_COLLECTION}/${requestId}`
  );
  await updateDoc(requestDocPath, { status: newStatus });
}

// 5.Function to delete request from termsRequest sub-collection
export async function deleteFixedTermRequestStatus(userId, requestId) {
  const requestDocPath = doc(
    db,
    `${ADMINDASH_COLLECTION}/${userId}/${TERMS_REQUEST_SUB_COLLECTION}/${requestId}`
  );
  await deleteDoc(requestDocPath);
}

// 6.Function to add term to user's terms sub-collection
export async function addTermToUserCollection(userId, termData) {
  try {
    const userTermsHoldingsPath = collection(
      db,
      `users/${userId}/fixedTermDeposits`
    );
    const docRef = await addDoc(userTermsHoldingsPath, termData);
    const docId = docRef.id;

    if (termData.type === "withdrawal") {
      const cashDepositsRef = collection(db, `users/${userId}/cashDeposits`);

      await addDoc(cashDepositsRef, {
        type: "Sales",
        status: "Cleared",
        reference: "Sale of Terms",
        date: termData.date,
        amount: termData.principalAmount,
      });
    }
    return { success: true, id: docId };
  } catch (error) {
    console.error("Error adding term:", error);
    return { success: false, error: error.message };
  }
}

// 7.Function to update term in user's terms subcollection
export async function updateTermInUserCollection(userId, termId, termData) {
  try {
    const userTermsHoldingsPath = collection(
      db,
      `${USERS_COLLECTION}/${userId}/fixedTermDeposits/`
    );
    const docRef = doc(userTermsHoldingsPath, termId);
    await updateDoc(docRef, termData);
    const docId = docRef.id;
    if (termData.type === "withdrawal") {
      const cashDepositsRef = collection(db, `users/${userId}/cashDeposits`);

      await addDoc(cashDepositsRef, {
        type: "Sales",
        status: "Cleared",
        reference: "Sale of Terms",
        date: termData.date,
        amount: termData.principalAmount,
      });
    }
    return { success: true, id: docId };
  } catch (error) {
    console.error("Error updating term:", error);
    return { success: false, error: error.message };
  }
}

// 8.Function to delete term from user's terms subcollection
export async function deleteTermFromUserCollection(userId, termId) {
  try {
    const userTermsHoldingsPath = collection(
      db,
      `users/${userId}/fixedTermDeposits/`
    );
    const docRef = doc(userTermsHoldingsPath, termId);
    await deleteDoc(docRef);
    return { success: true };
  } catch (error) {
    console.error("Error deleting term:", error);
    return { success: false, error: error.message };
  }
}


export const getSpecificTermRequest = async (requestId, uid) => {
  const requestRef = doc(
    db,
    ADMINDASH_COLLECTION,
    uid,
    TERMS_REQUEST_SUB_COLLECTION,
    requestId
  );
  const requestSnapshot = await getDoc(requestRef);
  return requestSnapshot.data();
};
