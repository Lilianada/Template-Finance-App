import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  query,
  getDocs,
  where,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";

const USERS_COLLECTION = "users";
const BANKING_DETAILS_SUB_COLLECTION = "bankingDetails";

export async function manageBankingDetails(uid, formData, bankingDetailsId) {
  const bankingDetailsRef = collection(
    db,
    USERS_COLLECTION,
    uid,
    BANKING_DETAILS_SUB_COLLECTION
  );

  // Build the query to check for existing details (if updating)
  let querySnapshot = null;
  const checkForDuplicates = !bankingDetailsId || formData.accountNumber; // Check for duplicates only if updating or account number provided
  if (checkForDuplicates) {
    const existingDetailsQuery = query(
      bankingDetailsRef,
      where("accountName", "==", formData.accountName),
      where("bankName", "==", formData.bankName),
      where("branch", "==", formData.branch),
      where("bsbNumber", "==", formData.bsbNumber),
      checkForDuplicates &&
        where("accountNumber", "!=", bankingDetailsId ? bankingDetailsId : null) // Exclude matching account number for updates
    );
    querySnapshot = await getDocs(existingDetailsQuery);
  }

  // Handle based on presence/absence of bankingDetailsId
  if (bankingDetailsId) {
    // Update scenario (bankingDetailsId exists)
    if (querySnapshot.empty) {
      // No matching documents found, throw error (data might be tampered with)
      throw new Error(
        "Details not found. Data might be tampered with. Please refresh and try again."
      );
    } else {
      // Documents found, update the specific document
      const updateBankingDetailsRef = doc(
        db,
        USERS_COLLECTION,
        uid,
        BANKING_DETAILS_SUB_COLLECTION,
        bankingDetailsId
      );
      try {
        await updateDoc(updateBankingDetailsRef, formData);
        return; // Indicate successful update (optional)
      } catch (error) {
        throw error;
      }
    }
  } else {
    // Add scenario (no bankingDetailsId)
    if (querySnapshot && !querySnapshot.empty) {
      // Documents with the same details (excluding account number for updates) exist, throw error
      throw new Error(
        "Details already exist. Please check account name, bank name, and branch."
      );
    } else {
      // No matching documents found, proceed to add a new document
      await addDoc(bankingDetailsRef, formData);
      return; // Indicate successful addition (optional)
    }
  }
}

export async function getBankingDetails(uid) {
  const bankingDetailsQuery = query(
    doc(db, USERS_COLLECTION, uid),
    BANKING_DETAILS_SUB_COLLECTION
  );
  const querySnapshot = await getDocs(bankingDetailsQuery);

  if (querySnapshot.empty) {
    return null; // Return null if no banking details are found
  }

  return querySnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));
}

export function deleteBankingDetails(uid, bankingDetailsId) {
  return deleteDoc(
    doc(
      db,
      USERS_COLLECTION,
      uid,
      BANKING_DETAILS_SUB_COLLECTION,
      bankingDetailsId
    )
  );
}
