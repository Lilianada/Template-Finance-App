import { PaperAirplaneIcon } from "@heroicons/react/20/solid";
import { useEffect, useRef } from "react";

export default function ChatBox({
  newMessage,
  setNewMessage,
  handleSendMessage,
}) {
  const textareaRef = useRef(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [newMessage]);

  return (
    <div className="flex items-start space-x-4 space-y-2 py-4 sm:space-y-4 sm:px-6 lg:px-8">
      <div className="min-w-0 flex-1">
        <form action="#" className="relative" onSubmit={handleSendMessage}>
          <div className="overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600 flex justify-between py-3 px-3">
            <label htmlFor="message" className="sr-only">
              Write a reply
            </label>
            <textarea
              ref={textareaRef}
              rows={1}
              name="message"
              id="message"
              className="block w-full resize-none border-0 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              placeholder="Write a reply..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />

            <div className="flex-shrink-0">
              <button
                type="submit"
                className="inline-flex items-center rounded-[50%] bg-indigo-600 px-2 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                <PaperAirplaneIcon className="h-4 w-4 text-white" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
