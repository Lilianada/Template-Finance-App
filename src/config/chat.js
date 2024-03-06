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
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    setDoc,
  } from "firebase/firestore";
  import { db } from "./firebase";
  const ADMINUSERS_COLLECTION = "adminUsers";
  const USERS_COLLECTION = "users";
  
  
  //LIVE CHAT
  const CHATS_SUBCOLLECTION = "chats";
  
  // Fetch all users with CHATS_SUBCOLLECTION in their doc
  export function fetchChats(db, setChats) {
    // Reference to the 'activeChats' subcollection within 'chatRoom'
    const activeChatsRef = collection(
      db,
      ADMINUSERS_COLLECTION,
      "chatRoom",
      "activeChats"
    );
  
    // Listen for real-time updates in the 'activeChats' subcollection
    onSnapshot(activeChatsRef, async (activeChatsSnapshot) => {
      let usersWithChats = [];
  
      // Iterate over each active chat document
      for (const activeChatDoc of activeChatsSnapshot.docs) {
        const userUid = activeChatDoc.id;
        const userRef = doc(db, "users", userUid);
  
        // Fetch user details
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          usersWithChats.push({
            userId: userUid,
            userName: userDoc.data().fullName,
          });
        }
      }
  
      // Update the state with the list of users who have active chats
      setChats(usersWithChats);
    });
  }
  
  //Sum of live chats
  export function countUsersWithChats(db, setUsersWithChatsCount) {
    // Reference to the 'activeChats' subcollection within 'chatRoom'
    const activeChatsRef = collection(
      db,
      ADMINUSERS_COLLECTION,
      "chatRoom",
      "activeChats"
    );
  
    // Listen for real-time updates in the 'activeChats' subcollection
    onSnapshot(activeChatsRef, (activeChatsSnapshot) => {
      // Count is simply the number of documents in the 'activeChats' subcollection
      const activeChatsCount = activeChatsSnapshot.size;
      setUsersWithChatsCount(activeChatsCount);
    });
  }
  
  // Fetch all chats within the CHATS_SUBCOLLECTION subcollection for an individual user
  export const fetchChatMessages = (userUid, callback) => {
    try {
      const messagesRef = collection(
        db,
        USERS_COLLECTION,
        userUid,
        CHATS_SUBCOLLECTION
      );
      const q = query(messagesRef, orderBy("timeStamp", "asc"));
  
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const chats = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        callback(chats);
      });
  
      return unsubscribe; // Function to stop listening to changes
    } catch (err) {
      console.error(err);
      throw new Error("Failed to load chat messages");
    }
  };
  
  // Close Chat
  export const closeChat = async (db, userUid) => {
    try {
      const chatsRef = collection(
        db,
        USERS_COLLECTION,
        userUid,
        CHATS_SUBCOLLECTION
      );
      const querySnapshot = await getDocs(query(chatsRef));
  
      // Delete each chat document
      for (const doc of querySnapshot.docs) {
        await deleteDoc(doc.ref);
      }
  
      // Add a notification to the user's notifications subcollection
      await addDoc(collection(db, USERS_COLLECTION, userUid, "notifications"), {
        message: "Your issue has been resolved.",
        timeStamp: serverTimestamp(),
      });
      // Remove user from 'chatRoom'
      const chatRoomRef = doc(
        db,
        ADMINUSERS_COLLECTION,
        "chatRoom",
        "activeChats",
        userUid
      );
      await deleteDoc(chatRoomRef);
    } catch (err) {
      console.error("Failed to close the chat:", err);
      throw new Error("Failed to close the chat");
    }
  };
  
  // Send Message
  export const sendMessage = async (userUid, chatMessage) => {
    try {
      // Create a new chat document reference
      const newChatRef = doc(
        collection(db, "users", userUid, CHATS_SUBCOLLECTION)
      );
      const chatId = newChatRef.id;
      console.log(chatId);
      // Initialize the new chat document with the chat message and other data
      await setDoc(newChatRef, {
        chat: chatMessage,
        timeStamp: serverTimestamp(),
        read: false,
        user: "admin", // or the client's identifier
        id: userUid,
        chatId: chatId,
        // userName: fullName,
      });
      return chatId;
    } catch (err) {
      console.error(err);
      throw new Error("Failed to send chat");
    }
  };
  
  // Real-time Chat Updates
  export const subscribeToChatUpdates = (userUid, chatId, callback) => {
    if (!userUid || !chatId) {
      console.error("Invalid userUid or chatId");
      return () => {};
    }
  
    const docRef = doc(
      db,
      USERS_COLLECTION,
      userUid,
      CHATS_SUBCOLLECTION,
      chatId
    );
  
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      // console.log('Snapshot data:', snapshot.data());
      if (snapshot.exists()) {
        callback(snapshot.data().messages);
      } else {
        console.log("No such document!");
      }
    });
  
    return unsubscribe;
  };
  