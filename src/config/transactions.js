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
    updateDoc,
  } from "firebase/firestore";
  import { db } from "./firebase";
  const USERS_COLLECTION = "users";
  
  // Transactions
  const TRANSACTIONS_SUB_COLLECTION = "transactions";
  
  export async function getAllTransactions() {
    // Get a reference to the USERS_COLLECTION
    const usersRef = collection(db, USERS_COLLECTION);
    const usersSnapshot = await getDocs(usersRef);
  
    let allTransactions = [];
  
    // Iterate over each user and get their transactions
    for (const userDoc of usersSnapshot.docs) {
      const userUid = userDoc.id;
      const userName = userDoc.data().fullName;
      const transactionsRef = collection(
        db,
        USERS_COLLECTION,
        userUid,
        TRANSACTIONS_SUB_COLLECTION
      );
      const transactionsSnapshot = await getDocs(transactionsRef);
  
      const userTransactions = transactionsSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        userId: userUid,
        userName: userName,
      }));
  
      allTransactions = [...allTransactions, ...userTransactions];
    }
  
    // If there are no transactions at all, return null
    if (allTransactions.length === 0) {
      return null;
    }
  
    return allTransactions;
  }
  
  export async function addTransaction(userId, newTransaction) {
    try {
      const transactionsRef = collection(
        db,
        USERS_COLLECTION,
        userId,
        TRANSACTIONS_SUB_COLLECTION
      );
      const docRef = await addDoc(transactionsRef, newTransaction);
  
      return { success: true, id: docRef.id };
    } catch (error) {
      return { error: `Failed to add transaction: ${error.message}` };
    }
  }
  
  export async function editTransaction(userId, transactionId, updatedFields) {
    const transactionRef = doc(
      db,
      USERS_COLLECTION,
      userId,
      TRANSACTIONS_SUB_COLLECTION,
      transactionId
    );
  
    await updateDoc(transactionRef, updatedFields);
  
    return { success: true };
  }
  
  export async function deleteTransaction(userId, transactionId) {
    const transactionRef = doc(
      db,
      USERS_COLLECTION,
      userId,
      TRANSACTIONS_SUB_COLLECTION,
      transactionId
    );
  
    await deleteDoc(transactionRef);
  
    return { success: true };
  }
  