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
    getDocs,
    setDoc,
  } from "firebase/firestore";
  import { db } from "./firebase";
  
  const USERS_COLLECTION = "users";
  
  
  const CASH_DEPOSITS = "cashDeposits";
  
  // Function to fetch all the cash deposits
  export async function getCashDeposits() {
    try {
      // Get a reference to the USERS_COLLECTION
      const usersRef = collection(db, USERS_COLLECTION);
      const usersSnapshot = await getDocs(usersRef);
  
      let allCashDeposits = [];
  
      // Iterate over each user and get their cash deposits
      for (const userDoc of usersSnapshot.docs) {
        const userUid = userDoc.id;
        const userName = userDoc.data().fullName;
        const cashDepositsRef = collection(
          db,
          USERS_COLLECTION,
          userUid,
          CASH_DEPOSITS
        );
        const cashDepositsSnapshot = await getDocs(cashDepositsRef);
  
        const userCashDeposits = cashDepositsSnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
          userId: userUid,
          userName: userName,
        }));
  
        allCashDeposits = [...allCashDeposits, ...userCashDeposits];
      }
  
      // If there are no cash deposits at all, return null
      if (allCashDeposits.length === 0 || allCashDeposits === null) {
        return null;
      }
  
      return allCashDeposits;
    } catch (error) {
      console.error("Error in getCashDeposits:", error);
      throw new Error(
        "Failed to retrieve cash deposits. Please try again later."
      );
    }
  }
  
  // Handle Cash Deposits
  export const addCashDeposit = async (uid, depositData) => {
    try {
      // Reference to the cash deposits collection for the user
      const cashDepositsCollection = collection(
        db,
        USERS_COLLECTION,
        uid,
        CASH_DEPOSITS
      );
      const docRef = await addDoc(cashDepositsCollection, depositData);
      const docId = docRef.id;
  
      return { success: true, id: docId };
    } catch (error) {
      console.error("Error in addCashDeposit:", error);
      throw new Error("Failed to add the cash deposit. Please try again later.");
    }
  };
  
  // Update a cash deposit
  export const updateCashDeposit = async (uid, depositId, updatedDepositData) => {
    try {
      // Reference to the specific cash deposit document
      const cashDepositRef = doc(
        db,
        USERS_COLLECTION,
        uid,
        CASH_DEPOSITS,
        depositId
      );
  
      // Update the cash deposit document with the new data
      await setDoc(cashDepositRef, updatedDepositData, { merge: true });
  
      return { success: true, id: depositId };
    } catch (error) {
      console.error("Error in updateCashDeposit:", error);
      throw new Error(
        "Failed to update the cash deposit. Please try again later."
      );
    }
  };
  
  // Delete a cash deposit
  export const deleteCashDeposit = async (uid, depositId) => {
    try {
      // Reference to the specific cash deposit document
      const cashDepositRef = doc(
        db,
        USERS_COLLECTION,
        uid,
        CASH_DEPOSITS,
        depositId
      );
  
      // Delete the cash deposit document
      await deleteDoc(cashDepositRef);
    } catch (error) {
      console.error("Error in deleteCashDeposit:", error);
      throw new Error(
        "Failed to delete the cash deposit. Please try again later."
      );
    }
  };
  