import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useRef } from "react";

export default function CustomAlert({
  open,
  onClose,
  title,
  description,
  textColor,
  list,
  listItems,
  Icon,
  iconBgColor,
  iconTextColor,
  timer,
}) {
  const cancelButtonRef = useRef(null);

  useEffect(() => {
    let timerId;
    if (open && timer) {
      timerId = setTimeout(() => {
        onClose();
      }, timer);
    }
    return () => clearTimeout(timerId);
  }, [open, timer, onClose]);

  if (!open) return null;
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 overflow-y-auto z-50 "
        onClose={onClose}
        initialFocus={cancelButtonRef}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div
              className={`${iconBgColor} p-4 inline-block align-bottom rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full`}
            >
              <div className="flex gap-2 align-top">
                <div className="flex-shrink-0">
                  <Icon
                    className={`h-5 w-5 ${iconTextColor}`}
                    aria-hidden="true"
                  />
                </div>
                <div className="">
                  <Dialog.Title
                    as="h3"
                    className={`text-sm font-bold ${textColor}`}
                  >
                    {title}
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className={`text-sm ${textColor}`}>{description}</p>
                  </div>
                </div>
              </div>

              {list === true && listItems.length > 0 && (
                <div className="mt-2 text-sm text-red-700">
                  <ul className="list-disc space-y-1 pl-5">
                    {listItems.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
