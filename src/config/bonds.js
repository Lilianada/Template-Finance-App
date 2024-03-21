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

const ADMINDASH_COLLECTION = "admin_users";
const USERS_COLLECTION = "users";
const HOLDINGS_SUB_COLLECTION = "bondsHoldings";
const BONDS_REQUEST_SUB_COLLECTION = "bondsRequest";

export async function getBondRequests() {
  try {
    const adminDashRef = collection(db, ADMINDASH_COLLECTION);
    const adminDashSnapshot = await getDocs(adminDashRef);

    if (adminDashSnapshot.empty) {
      console.warn("No documents found in admin users collection");
      return [];
    }

    let allBondRequests = [];

    for (const adminDoc of adminDashSnapshot.docs) {
      const userId = adminDoc.id;
      const bondRequestsRef = collection(
        db,
        ADMINDASH_COLLECTION,
        userId,
        "bondsRequest"
      );
      const bondRequestsSnapshot = await getDocs(bondRequestsRef);
      if (bondRequestsSnapshot.empty) continue;

      const userBondRequests = bondRequestsSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        userId: userId,
      }));
      allBondRequests = [...allBondRequests, ...userBondRequests];
    }
    return allBondRequests;
  } catch (error) {
    console.error("Error in getBondRequests: ", error);
    return [];
  }
}

export async function getUserBonds(userUid) {
  try {
    // Create a reference directly to the specific user's cash deposits
    const bondDepositsRef = collection(
      db,
      USERS_COLLECTION,
      userUid,
      HOLDINGS_SUB_COLLECTION
    );

    // Get the initial data
    const snapshot = await getDocs(bondDepositsRef);
    const userBondDeposits = snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    // Return the bond deposits
    return userBondDeposits;
  } catch (error) {
    console.error("Error in getUserBondDeposits:", error);
    throw new Error(
      "Failed to retrieve bond deposits for the user. Please try again later."
    );
  }
}

// Sum of bond requests
export async function sumBondRequests(db, setBondRequestsCount) {
  const adminDashRef = collection(db, ADMINDASH_COLLECTION);
  let totalBondRequestsCount = 0;
  let activeListeners = 0;

  onSnapshot(adminDashRef, (adminDocs) => {
    totalBondRequestsCount = 0; // Reset count for each update
    activeListeners = adminDocs.size;

    if (activeListeners === 0) {
      setBondRequestsCount(0); // If no admin docs, set count to 0
    }

    adminDocs.forEach((doc) => {
      try {
        const bondRequestsRef = collection(
          db,
          ADMINDASH_COLLECTION,
          doc.id,
          BONDS_REQUEST_SUB_COLLECTION
        );

        onSnapshot(bondRequestsRef, (bondRequestsSnapshot) => {
          totalBondRequestsCount += bondRequestsSnapshot.size;

          activeListeners -= 1;
          if (activeListeners === 0) {
            setBondRequestsCount(totalBondRequestsCount); // Update count when all listeners reported
          }
        });
      } catch (error) {
        console.error("Error in sumsumming requests ", error);
      }
    });
  });
}

// Function to handle selling bonds
export async function handleSellApproval(uid, bondData) {
  const userBondsPath = `users/${uid}/bondsHoldings`;
  const bondDocRef = doc(db, `${userBondsPath}/${bondData.id}`); // Assuming bondData.id is unique for each bond

  const bondDoc = await getDoc(bondDocRef);

  if (bondDoc.exists()) {
    // If bond exists in user's holdings, update it or delete it
    const currentData = bondDoc.data();

    if (currentData.quantity > bondData.quantity) {
      const newQuantity = currentData.quantity - bondData.quantity;
      const newCurrentValue = currentData.currentValue - bondData.currentValue;

      await updateDoc(bondDocRef, {
        quantity: newQuantity,
        currentValue: newCurrentValue,
      });
    } else {
      // If all units of this bond are being sold, remove it from user's holdings
      await deleteDoc(bondDocRef);
    }
  } else {
    console.error("Bond does not exist in user's holdings");
  }
}

// Function to handle buying bonds
export async function handleBuyApproval(uid, bondData) {
  // Check if bondData and its id are defined
  if (!bondData) {
    console.error("Invalid bondData:", bondData);
    return;
  }

  const userBondsPath = `users/${uid}/bondsHoldings`;
  const bondDocRef = doc(db, `${userBondsPath}/${bondData.id}`);

  const bondDoc = await getDoc(bondDocRef);

  // Calculate the quantity the user is buying
  const minInvestmentAmount = bondData.minimumAmount || 1;
  const newQuantity = Math.floor(
    bondData.amountRequested / minInvestmentAmount
  );

  if (bondDoc.exists()) {
    const currentData = bondDoc.data();

    // Check if all fields are defined
    if (
      currentData.quantity === undefined ||
      currentData.currentValue === undefined ||
      bondData.amountRequested === undefined
    ) {
      console.error(
        "Undefined fields in currentData or bondData:",
        currentData,
        bondData
      );
      return;
    }

    const updatedQuantity = currentData.quantity + newQuantity;
    const updatedCurrentValue =
      currentData.currentValue + bondData.amountRequested;

    await updateDoc(bondDocRef, {
      quantity: updatedQuantity,
      currentValue: updatedCurrentValue,
    });
  } else {
    // Check if bondData.amount is defined
    if (bondData.amountRequested === undefined) {
      console.error("Undefined amount in bondData:", bondData);
      return;
    }

    await setDoc(bondDocRef, {
      ...bondData,
      quantity: newQuantity,
      currentValue: bondData.amountRequested,
    });
  }
}

// Function to update request status in the Firestore
export async function updateRequestStatusInFirestore(
  userId,
  requestId,
  newStatus
) {
  const requestDocPath = doc(
    db,
    `${ADMINDASH_COLLECTION}/${userId}/${BONDS_REQUEST_SUB_COLLECTION}/${requestId}`
  );
  await updateDoc(requestDocPath, { status: newStatus });
}

// Function to add bond to user's bondsHoldings sub-collection
export async function addBondToUserHoldings(userId, requestData) {
  const userBondsHoldingsPath = collection(db, `users/${userId}/bondsHoldings`);
  await addDoc(userBondsHoldingsPath, requestData);
}

// Function to delete request from bondsRequest sub-collection
export async function deleteRequestFromFirestore(userId, requestId, newStatus) {
  const requestDocPath = doc(
    db,
    `${ADMINDASH_COLLECTION}/${userId}/${BONDS_REQUEST_SUB_COLLECTION}/${requestId}`
  );
  await deleteDoc(requestDocPath);
}

// Function to fetch bond data from a specific request
export async function fetchRequestData(userId, requestId) {
  const requestDocPath = doc(
    db,
    `${ADMINDASH_COLLECTION}/${userId}/${BONDS_REQUEST_SUB_COLLECTION}/${requestId}`
  );
  return (await getDoc(requestDocPath)).data();
}

//BONDS
const BONDS_COLLECTION = "bonds";
//get all bonds
export async function getAllBonds() {
  // Get a reference to the 'bonds' collection
  const bondsRef = collection(db, BONDS_COLLECTION);
  const bondsSnapshot = await getDocs(bondsRef);

  const allBonds = bondsSnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));

  // If there are no bonds at all, return null
  if (allBonds.length === 0) {
    return null;
  }

  return allBonds;
}

//add new bonds
export async function addNewBond(bondData) {
  try {
    const bondsRef = collection(db, "bonds");
    const newBondRef = await addDoc(bondsRef, bondData);
    return { success: true, id: newBondRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

//update existing bond
export async function updateBond(bondId, updatedData) {
  try {
    const bondRef = doc(db, "bonds", bondId);
    await updateDoc(bondRef, updatedData);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

//delete
export async function deleteBond(bondId) {
  try {
    const bondRef = doc(db, "bonds", bondId);
    await deleteDoc(bondRef);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

//add new bonds for a particular user
export async function addBondUser(userId, bondData) {
  try {
    const bondsRef = collection(db, USERS_COLLECTION, userId, "bondsHoldings");
    const newBondRef = await addDoc(bondsRef, bondData);
    return { success: true, id: newBondRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

//update new bonds for a particular user
export async function updateBondUser(userId, bondId, bondData) {
  try {
    const userIposHoldingsPath = collection(
      db,
      `users/${userId}/bondsHoldings` // Reference to the subcollection
    );

    const docRef = doc(userIposHoldingsPath, bondId); // Reference to the specific document within the subcollection
    await updateDoc(docRef, bondData);
    const docId = docRef.id;
    return { success: true, id: docId };
  } catch (error) {
    console.error("Error updating ipos:", error);
    return { success: false, error: error.message };
  }
}

export const deleteUserBond = async (uid, requestId) => {
  try {
    const requestRef = doc(
      db,
      USERS_COLLECTION,
      uid,
      "bondsHoldings",
      requestId
    );
    await deleteDoc(requestRef);
  } catch (error) {
    console.error("Error deleting IPO: ", error);
    throw error;
  }
};
