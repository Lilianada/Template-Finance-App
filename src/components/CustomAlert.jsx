import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useRef } from "react";

export default function CustomAlert({
  open,
  onClose,
  title,
  description,
  list,
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
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={onClose}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Icon
                        className={`h-5 w-5 ${iconBgColor}`}
                        aria-hidden="true"
                      />
                    </div>
                    <div className="ml-3">
                      <h3 className={`text-sm font-medium ${iconTextColor}`}>
                        {title}{" "}
                      </h3>
                      <div className={`mt-2 text-sm ${iconTextColor}`}>
                        <p>{description}</p>
                      </div>
                      {list && list.length > 0 && (
                        <div className="mt-2 text-sm text-red-700">
                          <ul className="list-disc space-y-1 pl-5">
                            {list.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
