import React, { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import DotLoader from "../../../../components/DotLoader";
import { convertDateToISO, getCurrentDate } from "../../../../config/utils";
import { customModal } from "../../../../config/modalUtils";
import { useModal } from "../../../../context/ModalContext";
import {
  CheckIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import CurrencyInput from "react-currency-input-field";
import { addBondUser } from "../../../../config/bonds";

export default function AddUserBonds () {
  const { userId } = useParams();
  const [bondAmount, setBondAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false);
  const { showModal, hideModal } = useModal();
  const [bond, setBond] = useState({
    issuerName: "",
    currentValue:"",
    quantity: 0,
    purchaseDate: "",
    maturityDate: "",
  });

  const handleBuyBonds = async () => {
    const minimumInvestmentAmount = bond.minimumAmount;
  
    // Calculate how many bonds the user is buying
    const amountAsNumber = parseFloat(bondAmount);
    const numberOfBondsBought = amountAsNumber / minimumInvestmentAmount;
  
    // Create bond data
    const bondData = {
      amountRequested: amountAsNumber,
      image: bond.image,
      type: bond.type,
      couponRate: bond.couponRate,
      companyWebsite: bond.companyWebsite,
      isin: bond.isin,
      maturityDate: bond.maturityDate,
      purchaseDate: getCurrentDate(),
      currentValue: amountAsNumber,
      issuerName: bond.issuerName,
      sector: bond.sector,
      couponFrequency: bond.couponFrequency,
      minimumAmount: bond.minimumAmount,
      typeOfRequest: "buy",
      quantity: numberOfBondsBought,
    };
    setIsLoading(true);
    try {
     const result= await addBondUser(
        userId.userId,
        bondData
      );
      const bondId = result.id;
      customModal({
        showModal,
        title: "Success",
        text: 'You have successfully made an investment on behalf of this user.',
        showConfirmButton: false,
        icon: CheckIcon,
        iconBgColor: "bg-green-100",
          iconTextColor: "text-green-600",
          buttonBgColor: "bg-green-600",
          timer: 2000,
      })
      setBondAmount(0);
    } catch (error) {
      console.error(error.message);
      customModal({
        showModal,
        title: "Error!",
        text: "There was an error making your investment. Please try again.",
        showConfirmButton: false,
        icon: ExclamationTriangleIcon,
        iconBgColor: "bg-red-100",
        iconTextColor: "text-red-600",
        buttonBgColor: "bg-red-600",
        timer: 2000,
      });
    } finally {
    setIsLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "date") {
      const [year, month, day] = value.split("-");
      const formattedDate = `${day}-${month}-${year}`;
      setBond({ ...bond, [name]: formattedDate });
    } else {
      // For all other fields
      setBond({ ...bond, [name]: value });
    }
  };

  return (
    <form className="text-left bg-gray-50 px-6 py-8" onSubmit={handleBuyBonds}>
      <div className="space-y-12">
        <div className="">
          <h2 className="text-xl font-semibold leading-7 text-gray-900">
            Add Bond Information
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            If you wish to remove any information, please do so below by
            updating the field to "Nil" or "N/A." Any fields left blank will not
            be updated as the current data will be retained.
          </p>
        </div>

        <div className="pb-12">
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label
                htmlFor="issuerName"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Issuer Name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="issuerName"
                  id="issuerName"
                  onChange={handleChange}
                  value={bond.issuerName}
                  autoComplete="issuerName"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="currentValue"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Current Value
              </label>
              <div className="mt-2">
              <CurrencyInput
                  decimalSeparator="."
                  prefix="$"
                  name="amount"
                  placeholder="0"
                  defaultValue={0}
                  decimalsLimit={2}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  onValueChange={(value) => {
                    setBond((prevState) => ({
                      ...prevState,
                      amount: value,
                    }));
                  }}
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="quantity"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Quantity
              </label>
              <div className="mt-2">
                <input
                  id="quantity"
                  name="quantity"
                  type="text"
                  onChange={handleChange}
                  value={bond.quantity || ""}
                  required
                  autoComplete="quantity"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 capitalize"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="purchaseDate"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Purchase Date
              </label>
              <div className="mt-2">
                <input
                  type="purchaseDate"
                  name="purchaseDate"
                  id="purchaseDate"
                  onChange={handleChange}
                  value={bond.purchaseDate ? convertDateToISO(bond.purchaseDate) : ""}
                  autoComplete="date"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="sm:col-span-3">
              <label
                htmlFor="maturityDate"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Maturity Date
              </label>
              <div className="mt-2">
                <input
                  type="maturityDate"
                  name="maturityDate"
                  id="maturityDate"
                  onChange={handleChange}
                  value={bond.maturityDate ? convertDateToISO(bond.maturityDate) : ""}
                  autoComplete="maturityDate"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex space-x-6 justify-end">
        <button
          type="button"
          className="text-sm font-semibold leading-6 text-gray-900"
          onClick={() => window.history.back()}
        >
          Close
        </button>
        <button
          type="submit"
          className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
        >
          {isLoading ?(`Submitting ${<DotLoader />}`) : "Submit"}
        </button>
        
      </div>
    </form>
  );
}
