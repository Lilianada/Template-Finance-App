import React, { useState } from 'react';
import { useModal } from '../../../../context/ModalContext';
import { getCurrentDate } from '../../../../config/utils';

export default function AddUserStock({open, setOpen, stock, userId}) {
    const { showModal, hideModal } = useModal();
    const [isLoading, setIsLoading] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [formData, setFormData] = useState({
        symbol: "",
        companyName: "",
        type: "Buy",
        shares: 0,
        tradeDate: getCurrentDate(),
        tradePrice: 0,
        marketPrice: 0,
        tradeAmount: 0,
        value: 0,
        profitLoss: 0,
        status: "Pending",
      });

  return (
    <div>
      
    </div>
  )
}
