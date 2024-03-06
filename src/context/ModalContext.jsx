import React, { createContext, useContext, useState } from 'react';
import CustomModal from '../components/CustomModal';

const ModalContext = createContext();

export function ModalProvider({ children }) {
  const [modalProps, setModalProps] = useState({ open: false });

  const showModal = (props) => {
    setModalProps({ ...props, open: true });
  };

  const hideModal = () => {
    setModalProps({ open: false });
  };

  return (
    <ModalContext.Provider value={{ modalProps, showModal, hideModal }}>
      {children}
      <CustomModal {...modalProps} onClose={hideModal} />
    </ModalContext.Provider>
  );
}

export const useModal = () => useContext(ModalContext);
