import React, { useState } from 'react'
import { useModal } from '../../../../context/ModalContext';

export default function AddUserTerms({ setOpen, open, fixedTerm, setFixedTerm, userId}) {
  const {showModal} = useModal();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div>
      
    </div>
  )
}
