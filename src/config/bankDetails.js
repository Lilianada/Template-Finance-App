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
  const bankingDetailsRef = collection(
    db,
    USERS_COLLECTION,
    uid,
    BANKING_DETAILS_SUB_COLLECTION
  );

  if (detailsId) {
    const updateBankingDetailsRef = doc(
      db,
      USERS_COLLECTION,
      uid,
      BANKING_DETAILS_SUB_COLLECTION,
      detailsId
    );
    try {
      await addDoc(updateBankingDetailsRef, {
        accountName: formData.accountName,
        bankName: formData.bankName,
        branch: formData.branch,
        bsbNumber: formData.bsbNumber,
        accountNumber: formData.accountNumber,
        iban: formData.iban,
        swiftCode: formData.swiftCode,
      });
    } catch (error) {
      throw error;
    }
  } else {
    // No matching documents found, proceed to add a new document
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
    if (querySnapshot.empty) {
      try {
        await addDoc(bankingDetailsRef, {
          accountName: formData.accountName,
          bankName: formData.bankName,
          branch: formData.branch,
          bsbNumber: formData.bsbNumber,
          accountNumber: formData.accountNumber,
          iban: formData.iban,
          swiftCode: formData.swiftCode,
        });
      } catch (error) {
        throw error;
      }
    }
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
