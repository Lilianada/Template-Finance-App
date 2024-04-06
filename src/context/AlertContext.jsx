import React, { createContext, useContext, useState } from 'react';
import CustomAlert from '../components/CustomAlert';

const AlertContext = createContext();

export function AlertProvider({ children }) {
  const [alertProps, setAlertProps] = useState({ open: false });

  const showAlert = (props) => {
    setAlertProps({ ...props, open: true });
  };

  const hideAlert = () => {
    setAlertProps({ open: false });
  };

  return (
    <AlertContext.Provider value={{ alertProps, showAlert, hideAlert }}>
      {children}
      <CustomAlert {...alertProps} onClose={hideAlert} />
    </AlertContext.Provider>
  );
}

export const useAlert = () => useContext(AlertContext);
