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
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
  
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
          const querySnapshot = await getDocs(collection(db, "users", userId, "docs"));
          if (!querySnapshot.empty) {
            const docSnapshot = querySnapshot.docs[0]; // Assuming there's only one document
            return { id: docSnapshot.id, ...docSnapshot.data() };
          } else {
            throw new Error("No documents found for the user");
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
  
  export const uploadDocument = async (userId, fileDescription, file) => {
    const storage = getStorage();
    const uid = userId.userId;
    const storageRef = ref(storage, `${uid}/${file.name}`);
    console.log(fileDescription, file, uid);
    try {
      // Upload the document to Firebase Storage
      const uploadTask = uploadBytesResumable(storageRef, file);
  
      // Set up event listeners for the upload task if needed
      // For example, to track upload progress
  
      // Wait for the upload to complete
      const snapshot = await uploadTask;
  
      // Get the download URL of the uploaded file
      const downloadURL = await getDownloadURL(snapshot.ref);
  
      // Add the metadata to Firestore
      const userDocCollectionRef = collection(db, "users", uid, "docs");
      const docData = {
        fileDescription,
        downloadURL,
      };
  
      await addDoc(userDocCollectionRef, docData);
    } catch (error) {
      console.error("Error during file upload or Firestore save:", error);
      throw error;
    }
  };
  
  export const updateDocumentInFirestore = async (
    userId,
    documentId,
    fileDescription,
    file
  ) => {
    try {
      // Create a reference to the Firestore document
      const docRef = doc(db, "users", userId, "docs", documentId);
  
      // Create a reference to the Firebase Storage for the user
      const storage = getStorage();
      const storagePath = ref(storage, `${userId}/${file.name}`);
  
      // Update the document data with the new file description and file URL
      const updatedDocData = {
        fileDescription,
        downloadURL: storagePath.fullPath, // You may need to adjust this based on your storage structure
      };
  
      // Update the document in Firestore
      await updateDoc(docRef, updatedDocData);
    } catch (error) {
      throw error;
    }
  };