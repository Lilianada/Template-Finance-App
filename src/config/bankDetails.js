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

export async function manageBankingDetails(uid, formData, detailsId) {
  console.log(formData)
  const bankingDetailsRef = collection(
    db,
    USERS_COLLECTION,
    uid,
    BANKING_DETAILS_SUB_COLLECTION
  );
  const updateBankingDetailsRef = doc(
    db,
    USERS_COLLECTION,
    uid,
    BANKING_DETAILS_SUB_COLLECTION,
    detailsId
  );
  // Create a query to check for existing documents with the same details
  const dets = query(
    bankingDetailsRef,
    where("accountName", "==", formData.accountName),
    where("bankName", "==", formData.bankName),
    where("branch", "==", formData.branch),
    where("bsbNumber", "==", formData.bsbNumber),
    where("accountNumber", "==", formData.accountNumber)
  );

  // Execute the query to check for existing documents
  const querySnapshot = await getDocs(dets);
  if (!querySnapshot.empty) {
    try {
      await updateDoc(updateBankingDetailsRef, {
        accountName: formData.accountName,
        bankName: formData.bankName,
        branch: formData.branch,
        bsbNumber: formData.bsbNumber,
        accountNumber: formData.accountNumber,
        iban: formData.iban,
        swiftCode: formData.swiftCode
      });
    } catch (error) {
      throw error;
    }
  } else {
    // No matching documents found, proceed to add a new document
    return addDoc(bankingDetailsRef, {
      accountName: formData.accountName,
      bankName: formData.bankName,
      branch: formData.branch,
      bsbNumber: formData.bsbNumber,
      accountNumber: formData.accountNumber,
      iban: formData.iban,
      swiftCode: formData.swiftCode
    });
  }
}

export async function getBankingDetails(uid) {
  const bankingDetailsRef = collection(
    db,
    USERS_COLLECTION,
    uid,
    BANKING_DETAILS_SUB_COLLECTION
  );
  const bankingDetailsQuery = query(bankingDetailsRef);

  const querySnapshot = await getDocs(bankingDetailsQuery);

  if (querySnapshot.empty) {
    return null;
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
