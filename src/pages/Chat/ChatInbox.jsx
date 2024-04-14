import { Fragment, useEffect, useRef, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import {
  EllipsisVerticalIcon,
} from "@heroicons/react/20/solid";
import { Link } from "react-router-dom";
import ChatBox from "./ChatBox";
import { closeChat, fetchChatMessages, fetchChats, sendMessage, subscribeToChatUpdates } from "../../config/chat";
import { customModal } from "../../utils/modalUtils";
import { CheckIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { db } from "../../config/firebase";
import { useModal } from "../../context/ModalContext";

const messages = [
  {
    id: 1,
    subject: "Velit placeat sit ducimus non sed",
    sender: "Gloria Roberston",
    href: "#",
    date: "1d ago",
    datetime: "2021-01-27T16:35",
    preview:
      "Doloremque dolorem maiores assumenda dolorem facilis. Velit vel in a rerum natus facere. Enim rerum eaque qui facilis. Numquam laudantium sed id dolores omnis in. Eos reiciendis deserunt maiores et accusamus quod dolor.",
  },
  {
    id: 2,
    subject:
      "Nemo mollitia repudiandae adipisci explicabo optio consequatur tempora ut nihil",
    sender: "Virginia Abshire",
    href: "#",
    date: "1d ago",
    datetime: "2021-01-27T16:35",
    preview:
      "Doloremque dolorem maiores assumenda dolorem facilis. Velit vel in a rerum natus facere. Enim rerum eaque qui facilis. Numquam laudantium sed id dolores omnis in. Eos reiciendis deserunt maiores et accusamus quod dolor.",
  },
  {
    id: 3,
    subject:
      "Doloremque reprehenderit et harum quas explicabo nulla architecto dicta voluptatibus",
    sender: "Kyle Gulgowski",
    href: "#",
    date: "1d ago",
    datetime: "2021-01-27T16:35",
    preview:
      "Doloremque dolorem maiores assumenda dolorem facilis. Velit vel in a rerum natus facere. Enim rerum eaque qui facilis. Numquam laudantium sed id dolores omnis in. Eos reiciendis deserunt maiores et accusamus quod dolor.",
  },
  {
    id: 4,
    subject: "Eos sequi et aut ex impedit",
    sender: "Hattie Haag",
    href: "#",
    date: "1d ago",
    datetime: "2021-01-27T16:35",
    preview:
      "Doloremque dolorem maiores assumenda dolorem facilis. Velit vel in a rerum natus facere. Enim rerum eaque qui facilis. Numquam laudantium sed id dolores omnis in. Eos reiciendis deserunt maiores et accusamus quod dolor.",
  },
  {
    id: 5,
    subject: "Quisquam veniam explicabo",
    sender: "Wilma Glover",
    href: "#",
    date: "1d ago",
    datetime: "2021-01-27T16:35",
    preview:
      "Doloremque dolorem maiores assumenda dolorem facilis. Velit vel in a rerum natus facere. Enim rerum eaque qui facilis. Numquam laudantium sed id dolores omnis in. Eos reiciendis deserunt maiores et accusamus quod dolor.",
  },
  {
    id: 6,
    subject:
      "Est ratione molestiae modi maiores consequatur eligendi et excepturi magni",
    sender: "Dolores Morissette",
    href: "#",
    date: "1d ago",
    datetime: "2021-01-27T16:35",
    preview:
      "Doloremque dolorem maiores assumenda dolorem facilis. Velit vel in a rerum natus facere. Enim rerum eaque qui facilis. Numquam laudantium sed id dolores omnis in. Eos reiciendis deserunt maiores et accusamus quod dolor.",
  },
  {
    id: 7,
    subject: "Commodi deserunt aut veniam rem ipsam",
    sender: "Guadalupe Walsh",
    href: "#",
    date: "1d ago",
    datetime: "2021-01-27T16:35",
    preview:
      "Doloremque dolorem maiores assumenda dolorem facilis. Velit vel in a rerum natus facere. Enim rerum eaque qui facilis. Numquam laudantium sed id dolores omnis in. Eos reiciendis deserunt maiores et accusamus quod dolor.",
  },
  {
    id: 8,
    subject: "Illo illum aut debitis earum",
    sender: "Jasmine Hansen",
    href: "#",
    date: "1d ago",
    datetime: "2021-01-27T16:35",
    preview:
      "Doloremque dolorem maiores assumenda dolorem facilis. Velit vel in a rerum natus facere. Enim rerum eaque qui facilis. Numquam laudantium sed id dolores omnis in. Eos reiciendis deserunt maiores et accusamus quod dolor.",
  },
  {
    id: 9,
    subject: "Qui dolore iste ut est cumque sed",
    sender: "Ian Volkman",
    href: "#",
    date: "1d ago",
    datetime: "2021-01-27T16:35",
    preview:
      "Doloremque dolorem maiores assumenda dolorem facilis. Velit vel in a rerum natus facere. Enim rerum eaque qui facilis. Numquam laudantium sed id dolores omnis in. Eos reiciendis deserunt maiores et accusamus quod dolor.",
  },
  {
    id: 10,
    subject: "Aut sed aut illum delectus maiores laboriosam ex",
    sender: "Rafael Klocko",
    href: "#",
    date: "1d ago",
    datetime: "2021-01-27T16:35",
    preview:
      "Doloremque dolorem maiores assumenda dolorem facilis. Velit vel in a rerum natus facere. Enim rerum eaque qui facilis. Numquam laudantium sed id dolores omnis in. Eos reiciendis deserunt maiores et accusamus quod dolor.",
  },
];

const message = {
  subject: "Re: New pricing for existing customers",
  sender: "joearmstrong@example.com",
  status: "Open",
  items: [
    {
      id: 1,
      author: "Joe Armstrong",
      date: "Yesterday at 7:24am",
      datetime: "2021-01-28T19:24",
      body: "<p>Thanks so much! Can't wait to try it out.</p>",
    },
    {
      id: 2,
      author: "Monica White",
      date: "Wednesday at 4:35pm",
      datetime: "2021-01-27T16:35",
      body: `
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Malesuada at ultricies tincidunt elit et, enim. Habitant nunc, adipiscing non fermentum, sed est a, aliquet. Lorem in vel libero vel augue aliquet dui commodo.</p>
        <p>Nec malesuada sed sit ut aliquet. Cras ac pharetra, sapien purus vitae vestibulum auctor faucibus ullamcorper. Leo quam tincidunt porttitor neque, velit sed. Tortor mauris ornare ut tellus sed aliquet amet venenatis condimentum. Convallis accumsan et nunc eleifend.</p>
        <p><strong style="font-weight: 600;">Monica White</strong><br/>Customer Service</p>
      `,
    },
    {
      id: 3,
      author: "Joe Armstrong",
      date: "Wednesday at 4:09pm",
      datetime: "2021-01-27T16:09",
      body: `
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Malesuada at ultricies tincidunt elit et, enim. Habitant nunc, adipiscing non fermentum, sed est a, aliquet. Lorem in vel libero vel augue aliquet dui commodo.</p>
        <p>Nec malesuada sed sit ut aliquet. Cras ac pharetra, sapien purus vitae vestibulum auctor faucibus ullamcorper. Leo quam tincidunt porttitor neque, velit sed. Tortor mauris ornare ut tellus sed aliquet amet venenatis condimentum. Convallis accumsan et nunc eleifend.</p>
        <p>– Joe</p>
      `,
    },
  ],
};

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ChatInbox() {
    const { showModal, hideModal } = useModal();
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const unsubscribeRef = useRef(null);

  const loadChats = async () => {
    try {
      const fetchedChats = fetchChats();
      setChats(fetchedChats);
    } catch (error) {
      console.error(error);
      setError("Failed to load chats");
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
        setError(error.message);
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
      iconBgColor: 'bg-red-100',
      iconTextColor: 'bg-red-600',
      buttonBgColor: 'bg-red-600',
      confirmButtonBgColor: 'bg-red-600',
      confirmButtonText: 'Yes, close it',
      cancelButtonBgColor: 'bg-white',
      cancelButtonText: 'Cancel',
      onCancel: hideModal,
    //   onConfirm: async () => {
    //     try {
    //       setLoading(true);
    //       await closeChat(db, userId);
    //       customModal({
    //         showModal,
    //         title: 'Closed!',
    //         text: 'The chat has been closed.',
    //         icon: CheckIcon,
    //         iconBgColor: 'bg-green-100',
    //         iconTextColor: 'bg-green-600',
    //         showConfirmButton: false,
    //         buttonBgColor: 'bg-green-600'
    //       });
    //       setChats(chats.filter((chat) => chat.id !== chat.chatId));
    //       setSelectedChat(null);
    //       loadChats();
    //     } catch (err) {
    //       console.error(err);
    //       customModal({
    //         showModal,
    //         title: 'Error',
    //         text: 'Failed to close the chat.',
    //         icon: ExclamationTriangleIcon,
    //         iconBgColor: 'bg-red-100',
    //         iconTextColor: 'bg-red-600',
    //         showConfirmButton: false,
    //         buttonBgColor: 'bg-red-600'
    //       });
    //     } finally {
    //       setLoading(false);
    //     }
    //   }
    });
  };

  const handleSendMessage = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      await sendMessage(selectedChat.userId, newMessage);
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send message");
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
          <main className="min-w-0 flex-1 border-t border-gray-200 flex">
            <section
              aria-labelledby="message-heading"
              className="flex h-full min-w-0 flex-1 flex-col overflow-hidden xl:order-last"
            >
              {/* Top section */}
              <div className="flex-shrink-0 border-b border-gray-200 bg-white">
                <div className="flex h-16 flex-col justify-center">
                  <div className="px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between py-3">
                      <div>
                        <div className="isolate inline-flex rounded-md shadow-sm sm:space-x-3 sm:shadow-none">
                          <h1 className="text-lg font-medium text-gray-900">
                            You have messages from the following users! Click on
                            a chat to start responding.
                          </h1>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto">
                <div className="bg-gray-50 pb-6 pt-5 shadow">
                  <div className="px-4 sm:flex sm:items-baseline sm:justify-between sm:px-6 lg:px-8">
                    <div className="sm:w-0 sm:flex-1">
                      <h2
                        id="message-heading"
                        className="text-base font-medium text-gray-900"
                      >
                       You are now chatting with  {message.sender}
                      </h2>
                      <p className="mt-1 truncate text-sm text-gray-400">
                      {message.sender}
                      </p>
                    </div>

                    <div className="mt-4 flex items-center justify-between sm:ml-6 sm:mt-0 sm:flex-shrink-0 sm:justify-start">
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
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    type="button"
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
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    type="button"
                                    onClick={() => handleCloseChat(selectedChat.userId)}
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
                  </div>
                </div>
                {/* Thread section*/}
                <ul className="space-y-2 py-4 sm:space-y-4 sm:px-6 lg:px-8">
                  {chats.map((item, index) => (
                    <li
                      className="bg-white px-4 py-6 shadow sm:rounded-lg sm:px-6"
                      key={index}
                      onClick={() => handleChatSelection(item.userId, item.userName)}
                      title="Click to view chat"
                    >
                      <div className="sm:flex sm:items-baseline sm:justify-between">
                        <h3 className="text-sm font-medium">
                          <span className="text-gray-900">{item.userName}</span>
                        </h3>
                        <p className="mt-1 whitespace-nowrap text-sm text-gray-600 sm:ml-3 sm:mt-0">
                          <time dateTime={item.datetime}>{item.date}</time>
                        </p>
                      </div>
                      <div
                        className="mt-4 space-y-6 text-sm text-gray-400"
                        dangerouslySetInnerHTML={{ __html: item.body }}
                      />
                    </li>
                  ))}
                </ul>
                <ChatBox />
              </div>
            </section>

          </main>
        </div>
      </div>
    </>
  );
}
