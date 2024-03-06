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
    setDoc,
    doc,
    getDoc,
  } from "firebase/firestore";
  import { db } from "./firebase";
  const ADMINUSERS_COLLECTION = "adminUsers";
  
  //GENERAL SETTINGS
  
  // Function to fetch the password policy setting from Firestore
  export const fetchPasswordPolicySetting = async () => {
    try {
      const docRef = doc(db, ADMINUSERS_COLLECTION, "strongPasswordPolicy");
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        const isStrong = docSnap.data().isTrue;
        return isStrong;
      } else {
        return true;
      }
    } catch (error) {
      console.error("Error fetching password policy: ", error);
      throw error;
    }
  };
  
  // Function to fetch the chat setting from Firestore
  export const fetchChatFeature = async () => {
    try {
      const docRef = doc(db, ADMINUSERS_COLLECTION, "chatFeature");
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        const isDisplayed = docSnap.data().isDisplayed;
        return isDisplayed;
      } else {
        return true;
      }
    } catch (error) {
      console.error("Error fetching chat feature: ", error);
      throw error;
    }
  };
  
  // Function to fetch the tools setting from Firestore
  export const fetchToolsFeature = async () => {
    try {
      const docRef = doc(db, ADMINUSERS_COLLECTION, "toolFeature");
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        const isDisplayed = docSnap.data().isDisplayed;
        return isDisplayed;
      } else {
        return true;
      }
    } catch (error) {
      console.error("Error fetching tools feature: ", error);
      throw error;
    }
  };
  
  // Function to fetch the terms setting from Firestore
  export const fetchTermsFeature = async () => {
    try {
      const docRef = doc(db, ADMINUSERS_COLLECTION, "termsFeature");
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        const isTrue = docSnap.data().isTrue;
        return isTrue;
      } else {
        return true;
      }
    } catch (error) {
      console.error("Error fetching terms feature: ", error);
      throw error;
    }
  };
  
  // Function to fetch the bonds setting from Firestore
  export const fetchBondsFeature = async () => {
    try {
      const docRef = doc(db, ADMINUSERS_COLLECTION, "bondsFeature");
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        const isTrue = docSnap.data().isTrue;
        return isTrue;
      } else {
        return true;
      }
    } catch (error) {
      console.error("Error fetching bonds feature: ", error);
      throw error;
    }
  };
  
  // Function to fetch the ipos setting from Firestore
  export const fetchIposFeature = async () => {
    try {
      const docRef = doc(db, ADMINUSERS_COLLECTION, "iposFeature");
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        const isTrue = docSnap.data().isTrue;
        return isTrue;
      } else {
        return true;
      }
    } catch (error) {
      console.error("Error fetching bonds feature: ", error);
      throw error;
    }
  };
  
  //Function to fetch the tableSetting from Firestore
  export const fetchIposTablesFeature = async () => {
    try {
      const docRef = doc(db, ADMINUSERS_COLLECTION, "iposTableFeature");
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        const isTrue = docSnap.data().isTrue;
        return isTrue;
      } else {
        return true;
      }
    } catch (error) {
      console.error("Error fetching tables feature: ", error);
      throw error;
    }
  };
  
  // Function to update the password policy setting in Firestore
  export const updatePasswordPolicySetting = async (newValue) => {
    try {
      const docRef = doc(db, ADMINUSERS_COLLECTION, "strongPasswordPolicy");
      await setDoc(docRef, {
        isTrue: newValue,
      });
    } catch (error) {
      console.error("Error updating password policy: ", error);
      throw error;
    }
  };
  
  // Function to update the password policy setting in Firestore
  export const updateToolsFeature = async (newValue) => {
    try {
      const docRef = doc(db, ADMINUSERS_COLLECTION, "toolFeature");
      await setDoc(docRef, {
        isDisplayed: newValue,
      });
    } catch (error) {
      console.error("Error updating tools feature visibilty: ", error);
      throw error;
    }
  };
  
  // Function to update the bonds feature setting in Firestore
  export const updateBondsFeature = async (newValue) => {
    try {
      const docRef = doc(db, ADMINUSERS_COLLECTION, "bondsFeature");
      await setDoc(docRef, {
        isTrue: newValue,
      });
    } catch (error) {
      console.error("Error updating bonds feature visibilty: ", error);
      throw error;
    }
  };
  
  // Function to update the ipos feature setting in Firestore
  export const updateIposFeature = async (newValue) => {
    try {
      const docRef = doc(db, ADMINUSERS_COLLECTION, "iposFeature");
      await setDoc(docRef, {
        isTrue: newValue,
      });
    } catch (error) {
      console.error("Error updating ipos feature visibilty: ", error);
      throw error;
    }
  };
  
  // Function to update the tables feature setting in Firestore
  export const updateIposTablesFeature = async (newValue) => {
    try {
      const docRef = doc(db, ADMINUSERS_COLLECTION, "iposTableFeature");
      await setDoc(docRef, {
        isTrue: newValue,
      });
    } catch (error) {
      console.error("Error updating tables feature visibilty: ", error);
      throw error;
    }
  };
  
  // Function to update the terms feature setting in Firestore
  export const updateTermsFeature = async (newValue) => {
    try {
      const docRef = doc(db, ADMINUSERS_COLLECTION, "termsFeature");
      await setDoc(docRef, {
        isTrue: newValue,
      });
    } catch (error) {
      console.error("Error updating terms feature visibilty: ", error);
      throw error;
    }
  };
  
  // Function to update the password policy setting in Firestore
  export const updateChatFeature = async (newValue) => {
    try {
      const docRef = doc(db, ADMINUSERS_COLLECTION, "chatFeature");
      await setDoc(docRef, {
        isDisplayed: newValue,
      });
    } catch (error) {
      console.error("Error updating password policy: ", error);
      throw error;
    }
  };
  
  //Fetch meta data from adminUsers collection
  export const fetchMetaData = async () => {
    try {
      const docRef = doc(db, ADMINUSERS_COLLECTION, "metaData");
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        return docSnap.data().data || "";
      } else {
        return "";
      }
    } catch (error) {
      console.error("Error fetching existing meta data:", error);
      return ""; // Return empty string on error
    }
  };
  
  //Fetch title data from adminUsers collection
  export const fetchTitleData = async () => {
    try {
      const docRef = doc(db, ADMINUSERS_COLLECTION, "title");
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        return docSnap.data().text || "";
      } else {
        return "";
      }
    } catch (error) {
      console.error("Error fetching existing title data:", error);
      return ""; // Return empty string on error
    }
  };
  
  // handle update meta data
  export const updateMetaData = async (newMeta) => {
    try {
      const docRef = doc(db, ADMINUSERS_COLLECTION, "metaData");
      await setDoc(docRef, { data: newMeta });
      return "Meta data updated successfully.";
    } catch (error) {
      console.error("Error updating meta data:", error);
      throw error;
    }
  };
  
  // handle update title data
  export const updateTitleText = async (newTitle) => {
    try {
      const docRef = doc(db, ADMINUSERS_COLLECTION, "title");
      await setDoc(docRef, { text: newTitle });
      return "Title text updated successfully.";
    } catch (error) {
      console.error("Error updating meta data:", error);
      throw error;
    }
  };