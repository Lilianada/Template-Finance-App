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
    query,
    setDoc,
    updateDoc,
    where,
  } from "firebase/firestore";
  import { db } from "./firebase";
import { getCurrentDate } from "./utils";

  
  const ADMINUSERS_COLLECTION = "adminUsers";
  const USERS_COLLECTION = "users";
  
  
  
  // ADD STOCKS TO USER
  const STOCKS_COLLECTION = "stocks";
  // Function to get stock data from the user's database
  export async function getStockFromUserDB(userId) {
    try {
      const userDocRef = doc(db, USERS_COLLECTION, userId);
  
      const userDocSnap = await getDoc(userDocRef);
  
      if (userDocSnap.exists()) {
        // Creating a reference to the stocks sub-collection of the user's document
        const stocksCollectionRef = collection(userDocRef, STOCKS_COLLECTION);
        const stocksSnapshot = await getDocs(stocksCollectionRef);
  
        const stocksData = stocksSnapshot.docs.map((doc) => doc.data());
        return stocksData;
      } else {
        console.error(`User with ID ${userId} not found.`);
        return null;
      }
    } catch (error) {
      console.error("Error getting stock from user database: ", error);
      throw error;
    }
  }
  
  //Adding of stocks
  export async function addStockToPortfolio(userId, stockData) {
    try {
      if (typeof userId !== 'string') {
        throw new Error('UserId must be a string');
      }
  
      const userDocRef = doc(db, USERS_COLLECTION, userId);
      const docSnap = await getDoc(userDocRef);
  
      if (!docSnap.exists()) {
        await setDoc(userDocRef, { userId });
      }
  
      const stocksCollectionRef = collection(userDocRef, STOCKS_COLLECTION);
      const stockDataObj = {
        ...stockData,
        timestamp: getCurrentDate(),
      };
  
      // Create the document initially without the ID
      const docRef = await addDoc(stocksCollectionRef, stockDataObj);
  
      // Now, update the same document to include its own ID
      await updateDoc(docRef, { id: docRef.id });
  
      // Prepare and save notification data
      const notificationData = {
        message: `The user with id of ${userId} added a stock to their portfolio`,
        timeStamp: new Date(),
      };
      await addDoc(collection(db, ADMINUSERS_COLLECTION, 'notifications', 'stocksNotifications'), notificationData);
  
      // Return the complete stock data including the ID
      return { id: docRef.id, ...stockDataObj };
    } catch (error) {
      console.error('Error adding stock to portfolio: ', error);
      throw error;
    }
  }
  
  export async function editStockPortfolio(userId, stockId, updatedStockData) {
    try {
      // Creating a reference to the user's document
      const userDocRef = doc(db, USERS_COLLECTION, userId);
      
      const stocksCollectionRef = collection(userDocRef, STOCKS_COLLECTION); 
  
      const updatedStockDataObj = {
        ...updatedStockData,
        timestamp: getCurrentDate(),
      };
  
      await updateDoc(doc(stocksCollectionRef, stockId), updatedStockDataObj);
  
      const notificationData = {
        message: `The user with id of ${userId} updated a stock in their portfolio`,
        timeStamp: new Date(),
      };
      await addDoc(collection(db, ADMINUSERS_COLLECTION, 'notifications', 'stocksNotifications'), notificationData);
  
      return stockId; 
    } catch (error) {
      console.error('Error updating stock in portfolio: ', error);
      throw error; 
    }
  }
  
  export const updateStockPortfolio = async (userId, stockData) => {
    try {
      const userDocRef = doc(db, USERS_COLLECTION, userId.userId);
  
      // Get a reference to the specific stock document to update
      const stocksCollectionRef = collection(userDocRef, STOCKS_COLLECTION);
      const stockDocRef = query(stocksCollectionRef, where("symbol", "==", stockData.symbol)).limit(1);
      const stockSnapshot = await getDocs(stockDocRef);
  
      if (stockSnapshot.docs.length > 0) {
        // Update the existing stock document
        const stockDoc = stockSnapshot.docs[0];
        await updateDoc(stockDoc.ref, {
          ...stockData,
          timestamp: getCurrentDate(), // Update timestamp as well
        });
      } else {
        // If the stock doesn't exist yet, add it
        await addStockToPortfolio(userId, stockData);
      }
    } catch (error) {
      console.error("Error updating stock portfolio:", error);
      // Handle the error gracefully, e.g., display an error message to the user
    }
  };
  
  export const deleteStockFromDb = async (userId, stockId) => {
    console.log(userId, stockId)
    try {
      // Assuming your stocks are stored in a subcollection of a 'users' collection
      const stockDocRef = doc(db, 'users', userId, 'stocks', stockId);
      await deleteDoc(stockDocRef);
      console.log('Stock successfully deleted');
    } catch (error) {
      console.error('Error deleting stock:', error);
      throw error; // Throw the error to be handled by the caller
    }
  };