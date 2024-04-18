import { Fragment, useEffect, useRef, useState } from "react";
import {
  closeChat,
  fetchChatMessages,
  fetchChats,
  sendMessage,
  subscribeToChatUpdates,
} from "../../config/chat";
import { customModal } from "../../utils/modalUtils";
import {
  CheckIcon,
  EllipsisVerticalIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { useModal } from "../../context/ModalContext";
import ChatList from "./ChatList";
import ChatThread from "./ChatThread";
import { db } from "../../config/firebase";
import LoadingScreen from "../../components/LoadingScreen";
import { ChatBubbleLeftIcon } from "@heroicons/react/20/solid";
import { Menu, Transition } from "@headlessui/react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ChatInbox() {
  const { showModal, hideModal } = useModal();
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [closing, setClosing] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const unsubscribeRef = useRef(null);

  //Fetch chats
  const loadChats = async () => {
    try {
      fetchChats(db, setChats);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    loadChats();
  }, []);

  const handleChatSelection = (userUid, userName) => {
    setLoading(true);
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
    }
    unsubscribeRef.current = fetchChatMessages(
      userUid,
      (chats) => {
        if (chats.length > 0) {
          setSelectedChat({
            userId: userUid,
            messages: newMessage,
            userName: userName,
            chatId: chats[0].chatId,
          });
        } else {
          setSelectedChat(null);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Failed to fetch chat messages:", error);
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);

  const handleCloseChat = async (userId) => {
    customModal({
      showModal,
      showConfirmButton: true,
      title: "Are you sure?",
      text: "Do you want to close this chat?",
      icon: ExclamationTriangleIcon,
      iconBgColor: "bg-red-100",
      iconTextColor: "text-red-600",
      buttonBgColor: "bg-red-600",
      cancelButtonText: "Cancel",
      confirmButtonBgColor: "bg-red-600",
      confirmButtonText: "Yes, close it",
      confirmButtonTextColor: "text-white",
      cancelButtonBgColor: "bg-white",
      cancelButtonTextColor: "text-gray-800",
      onCancel: hideModal,
      onConfirm:  () => {
        closeUserChat(userId);
        hideModal();
      },
    });
  };

  const closeUserChat = async (userId) => {
    try {
      setClosing(true);
      await closeChat(db, userId);
      customModal({
        showModal,
        title: "Successful!",
        text: "The chat has been closed.",
        icon: CheckIcon,
        iconBgColor: "bg-green-100",
        iconTextColor: "text-green-600",
        buttonBgColor: "bg-green-600",
        timer: 2000,
        showConfirmButton: false,
      });
      setChats(chats.filter((chat) => chat.id !== chat.chatId));
      setSelectedChat(null);
      loadChats();
    } catch (err) {
      console.error(err);
      customModal({
        showModal,
        title: "Error",
        text: "Failed to close the chat.",
        icon: ExclamationTriangleIcon,
        iconBgColor: "bg-red-100",
        iconTextColor: "bg-red-600",
        showConfirmButton: false,
        buttonBgColor: "bg-red-600",
      });
    } finally {
      setClosing(false);
    }
  };

  const handleSendMessage = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      await sendMessage(selectedChat.userId, newMessage);
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedChat) return undefined;
    const userUid = selectedChat.userId;
    const chatId = selectedChat.chatId;
    const unsubscribe = subscribeToChatUpdates(
      userUid,
      chatId,
      (updatedMessages) => {
        setSelectedChat((currentSelectedChat) => {
          return { ...currentSelectedChat, messages: updatedMessages };
        });
      }
    );
    return () => unsubscribe();
  }, [selectedChat?.userUid, selectedChat?.id]);

  return (
    <>
      <div className="flex h-full flex-col">
        {/* Bottom section */}
        <div className="flex min-h-0 flex-1 overflow-hidden">
          {/* Main area */}
          <main className="min-w-0 flex-1 border-t border-gray-200 flex flex-col sm:flex-row">
            <section
              aria-labelledby="message-heading"
              className="flex h-full min-w-0 flex-1 flex-col overflow-hidden xl:order-last"
            >
              {/* Top section */}
              <div className="flex-shrink-0 border-b border-gray-200 bg-white">
                <div className="flex h-16 flex-col justify-center">
                  <div className="px-4 sm:px-6 lg:px-8">
                    <div className="isolate rounded-md sm:space-x-3 ">
                      {selectedChat ? (
                        <div className="flex justify-between py-4">
                          <h2
                            id="message-heading"
                            className="text-base font-medium text-gray-900"
                          >
                            You are now chatting with {selectedChat.userName}
                          </h2>
                          <Menu
                            as="div"
                            className="relative ml-3 inline-block text-left"
                          >
                            <div>
                              <Menu.Button className="-my-2 flex items-center rounded-full bg-white p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600">
                                <span className="sr-only">Open options</span>
                                <EllipsisVerticalIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </Menu.Button>
                            </div>

                            <Transition
                              as={Fragment}
                              enter="transition ease-out duration-100"
                              enterFrom="transform opacity-0 scale-95"
                              enterTo="transform opacity-100 scale-100"
                              leave="transition ease-in duration-75"
                              leaveFrom="transform opacity-100 scale-100"
                              leaveTo="transform opacity-0 scale-95"
                            >
                              <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div className="py-1">
                                  {/* <Menu.Item>
                                {({ active }) => (
                                  <button
                                  type="button"
                                    onClick={() => handleViewUser(selectedChat.userId)}
                                    className={classNames(
                                      active
                                        ? "bg-gray-100 text-gray-900"
                                        : "text-gray-700",
                                      "flex w-full justify-between px-4 py-2 text-sm"
                                    )}
                                  >
                                    <span>View User</span>
                                  </button>
                                )}
                              </Menu.Item> */}
                                  <Menu.Item>
                                    {({ active }) => (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleCloseChat(selectedChat.userId)
                                        }
                                        className={classNames(
                                          active
                                            ? "bg-gray-100 text-gray-900"
                                            : "text-gray-700",
                                          "flex w-full justify-between px-4 py-2 text-sm"
                                        )}
                                      >
                                        <span>Close Chat</span>
                                      </button>
                                    )}
                                  </Menu.Item>
                                </div>
                              </Menu.Items>
                            </Transition>
                          </Menu>
                        </div>
                      ) : (
                        <h1 className="text-lg font-medium text-gray-900">
                          Click on a chat to start responding.
                        </h1>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto">
                {loading ? (
                  <LoadingScreen />
                ) : selectedChat ? (
                  <ChatThread
                    selectedChat={selectedChat}
                    handleCloseChat={handleCloseChat}
                    handleSendMessage={handleSendMessage}
                    loading={loading}
                    newMessage={newMessage}
                    setNewMessage={setNewMessage}
                  />
                ) : (
                  <div className="grid place-items-center w-full h-[calc(100vh_-_196px)]  bg-gray-50">
                    <ChatBubbleLeftIcon className="h-20 text-gray-400" />
                    <h4>Click on a chat to start responding.</h4>
                  </div>
                )}
              </div>
            </section>
            {closing && <LoadingScreen />}
            <ChatList handleChatSelection={handleChatSelection} chats={chats} />
          </main>
        </div>
      </div>
    </>
  );
}
