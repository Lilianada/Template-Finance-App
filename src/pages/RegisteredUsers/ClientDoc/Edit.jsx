import React, { Fragment, useEffect, useState } from "react";
import { useModal } from "../../../context/ModalContext";
import {
  CheckIcon,
  XMarkIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import DotLoader from "../../../components/DotLoader";
import { Dialog, Transition } from "@headlessui/react";
import { updateDocument } from "../../../config/documents";
import { customModal } from "../../../utils/modalUtils";


export default function EditDoc({ setOpen, open, doc, userId, refresh }) {
  const { showModal } = useModal(); 
  const [isLoading, setIsLoading] = useState(false);
  const [fileDescription, setFileDescription] = useState('');
  const [file, setFile] = useState( null);
  const [fileName, setFileName] = useState(''); 

  useEffect(() => {
    if (doc) {
      setFileDescription(doc[0].fileDescription || '');
      setFileName(doc[0].fileName || '');
    }
  }, [doc]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      // Ensure file and fileDescription are properly defined
      if (!fileDescription) {
        throw new Error('File description must be provided.');
      }

      if (!doc || !doc[0].id) {
        await updateDocument(userId, fileDescription, file);
        customModal({
          showModal,
          title: 'Success',
          text: 'Document has been added successfully.',
          showConfirmButton: false,
          iconBgColor: 'bg-green-100',
          iconTextColor: 'text-green-600',
          buttonBgColor: 'bg-green-600',
          icon: CheckIcon,
          timer: 1500,
        });
        
      } else {
        await updateDocument(userId, fileDescription, file, doc[0].id);
        customModal({
          showModal,
          title: 'Success',
          text: 'Document has been updated successfully.',
          showConfirmButton: false,
          iconBgColor: 'bg-green-100',
          iconTextColor: 'text-green-600',
          buttonBgColor: 'bg-green-600',
          icon: CheckIcon,
          timer: 1500,
        });
      }
      
      setFileDescription('');
      setFile(null);
      setOpen(false); // Assuming this controls a modal or form visibility
      refresh(); // Refresh the list or state that depends on this document
    } catch (error) {
      console.error('Error during document update:', error);
  
      // Provide feedback on failure
      customModal({
        showModal,
        title: 'Error',
        text: `An error occurred while updating the document: ${error.message}`,
        showConfirmButton: false,
        icon: ExclamationCircleIcon,
        iconBgColor: 'bg-red-100',
        iconTextColor: 'text-red-600',
        buttonBgColor: 'bg-red-600',
        timer: 1500,
      });
    } finally {
      setIsLoading(false); // Ensure loading state is cleared
    }
  };
  

  const handleChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      setFileName(selectedFile.name);
    } else if (doc && doc.length > 0) {
      setFileName(doc[0].downloadURL || '');
    } else {
      setFileName('');
    }
  };
  

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        onClose={() => setOpen(false)}
      >
        <div className="flex items-center justify-center min-h-screen px-4 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
          </Transition.Child>

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
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
              <button
                type="button"
                className="absolute top-0 right-0 m-4 text-gray-500 hover:text-gray-600 focus:outline-none"
                onClick={() => setOpen(false)}
              >
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>

              <form
                className="text-left px-4 pt-6 pb-4"
                onSubmit={handleUpdate}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="space-y-6">
                  <div className="">
                    <h2 className="text-xl font-semibold leading-7 text-gray-900">
                      Update User Document
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-gray-600 flex">
                      Ensure there is a (✔️) in front of the file name before submitting.
                    </p>
                  </div>

                  <div className="pb-4">
                    <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-6">
                      <div className="sm:col-span-full">
                        <label
                          htmlFor="fileDescription"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Document Name
                        </label>
                        <input
                          type="text"
                          name="fileDescription"
                          id="fileDescription"
                          autoComplete="fileDescription"
                          value={fileDescription}
                          onChange={(e) => setFileDescription(e.target.value)}
                          required
                          className="mt-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      <div className="sm:col-span-full flex items-center">
                        <input
                          type="file"
                          name="image"
                          id="file"
                          className="hidden"
                          onChange={handleChange}
                          accept="image/pdf/*"
                        />
                        <button
                          type="button"
                          className="rounded-md bg-white px-2.5 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                          onClick={() => document.getElementById("file").click()}
                        >
                          Choose File
                        </button>
                        <span className="ml-2 text-sm text-gray-500 flex">
                          {fileName} {file && <CheckIcon className="h-5 w-5 text-green-500" />}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex space-x-6 justify-end">
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setOpen(false)}
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    {isLoading ? (
                      <div className="flex w-full justify-center align-middle gap-2">
                        <span>Submitting</span>
                        <DotLoader />
                      </div>
                    ) : (
                      'Submit'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}