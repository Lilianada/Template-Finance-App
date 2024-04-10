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
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

//DOCUMENTS
export const fetchDocument = async () => {
  const usersCollection = collection(db, "users");
  const userDocs = await getDocs(usersCollection);
  const allDocuments = [];
  for (const userDoc of userDocs.docs) {
    const user = userDoc.data();
    const docCollection = collection(userDoc.ref, "docs");
    const docDocs = await getDocs(docCollection);
    docDocs.docs.forEach((docDoc) => {
      allDocuments.push({
        userId: userDoc.id,
        ...docDoc.data(),
        fullName: user.fullName,
        docId: docDoc.id,
      });
    });
  }
  return allDocuments;
};

export const fetchUserDocument = async (userId) => {
  try {
    const querySnapshot = await getDocs(
      collection(db, "users", userId, "docs")
    );
    if (!querySnapshot.empty) {
      return querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
    } else {
      return;
    }
  } catch (error) {
    console.error("Error fetching document:", error);
    throw error;
  }
};

export const deleteDocument = async (userId, docId, fileName) => {
  const storage = getStorage();
  const storageRef = ref(storage, `${userId}/${fileName}`); // Construct the reference correctly

  try {
    await deleteObject(storageRef);
    const docRef = doc(db, "users", userId, "docs", docId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error during deletion:", error);
    throw error;
  }
};

export const updateDocument = async (userId, documentId, fileDescription, file) => {
  const storage = getStorage();
  const uid = userId; // Assuming userId is directly the user ID
  const storageRef = ref(storage, `${uid}/${file.name}`);
  console.log(fileDescription, file, uid);
  
  try {
    
    if (documentId) {
      const docRef = doc(db, "users", uid, "docs", documentId);
      // Check if the document exists
      // Document exists, update it
      const updatedDocData = {
        fileDescription,
        downloadURL: storageRef.fullPath, 
      };
      await updateDoc(docRef, updatedDocData);
    } else {
      // Document doesn't exist, upload a new one
      const uploadTask = uploadBytesResumable(storageRef, file);
      const snapshot = await uploadTask;
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Add the metadata to Firestore
      const userDocCollectionRef = collection(db, "users", uid, "docs");
      const docData = {
        fileDescription,
        downloadURL,
      };
      await addDoc(userDocCollectionRef, docData);
    }
  } catch (error) {
    console.error("Error during file upload or Firestore operation:", error);
    throw error;
  }
};
