import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useLocation } from "react-router-dom";
import { useModal } from "../../../../context/ModalContext";
import { getCurrentDate } from "../../../../config/utils";
import { addStockToPortfolio, updateStockPortfolio } from "../../../../config/stock";
import CurrencyInput from "react-currency-input-field";
import { CheckIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { customModal } from "../../../../config/modalUtils";
import DotLoader from "../../../../components/DotLoader";

export default function EditUserStock() {
    const location = useLocation();
  const { userId } = useParams();
  const { stockToEdit } = location.state || {};
  const { showModal } = useModal();
  const [isLoading, setIsLoading] = useState(false);
  const [stock, setStock] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [formData, setFormData] = useState({
    ...stockToEdit
  });

  const stockApiKey = process.env.REACT_APP_STOCK_API_KEY;

  const fetchStockData = async () => {
    setIsLoading(true);

    let exchange = ":NASDAQ";
    const exchangeIndex = inputValue.indexOf(":");
    if (exchangeIndex > -1) {
      exchange = inputValue.substring(exchangeIndex); // Extract exchange from input
    }
      const options = {
        method: 'GET',
        url: 'https://real-time-finance-data.p.rapidapi.com/stock-quote',
        params: { inputValue: `${inputValue}${exchange}`, language: 'en' },
        headers: {
            'X-RapidAPI-Key': stockApiKey, // Replace with your actual API Key
            'X-RapidAPI-Host': 'real-time-finance-data.p.rapidapi.com'
        }
    };

    try {
      const response = await axios.request(options);
      const data = response.data;

      if (data.status === "OK" && data.data.price) {
        const price = parseFloat(data.data.price).toFixed(2);
        updateStateWithStockData(price, data.data.name);
      } else {
        customModal({
          showModal,
          title: "Error!",
          text: `No data available for the specified symbol. Please try a differemt symbol.`,
          showConfirmButton: false,
          icon: ExclamationCircleIcon,
          iconBgColor: "bg-red-100",
          iconTextColor: "text-red-600",
          buttonBgColor: "bg-red-600",
          timer: 2000,
        });
      }
    } catch (error) {
      console.error("Error fetching stock details:", error);
      customModal({
        showModal,
        title: "Error!",
        text: `There was an error encountered. Please try a differemt symbol..`,
        showConfirmButton: false,
        icon: ExclamationCircleIcon,
        iconBgColor: "bg-red-100",
        iconTextColor: "text-red-600",
        buttonBgColor: "bg-red-600",
        timer: 2000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Simplified function to update the state based on latest stock data
  const updateStateWithStockData = (price, companyName) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      marketPrice: price,
      companyName: companyName,
    }));
  };

  useEffect(() => {
    recalculateDependentFields();
  }, [formData.type, formData.marketPrice, formData.shares, formData.tradePrice]);

  const recalculateDependentFields = () => {
    const { shares, tradePrice, marketPrice, type } = formData;
    const parsedShares = parseFloat(shares) || 0;
    const parsedTradePrice = parseFloat(tradePrice) || 0;
    const parsedMarketPrice = parseFloat(marketPrice) || 0;

    let tradeAmount, marketValue, profitLoss;
    tradeAmount = parsedShares * parsedTradePrice;
    marketValue = parsedShares * parsedMarketPrice;

    if (type === "Sell") {
      // When selling, calculate profit or loss
      profitLoss = ((marketValue - tradeAmount) / tradeAmount) * 100;
      console.log("sell", profitLoss, marketValue, tradeAmount);
    } else {
      // When buying, calculate total purchase price
      profitLoss = tradeAmount
        ? ((marketValue - tradeAmount) / tradeAmount) * 100
        : 0;
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      tradeAmount: tradeAmount.toFixed(2),
      value: marketValue.toFixed(2),
      profitLoss: profitLoss.toFixed(2),
    }));
  };

  // Centralized handling for input changes
  const handleInputChange = (e) => {
    let name, value;

    if (e && e.target) {
      name = e.target.name;
      value = e.target.value;
    } else {
      name = "tradePrice";
      value = e;
    }

    // Update the inputValue for symbol changes
    if (name === "symbol") {
      setInputValue(value);
      if (value) fetchStockData(value);
    } else {
      // For other fields, update formData directly
      const newFormData = { ...formData, [name]: value };
      setFormData(newFormData);
      // If shares or tradePrice change, recalculate dependent fields
      if (name === "shares" || name === "tradePrice") {
        recalculateDependentFields();
      }
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleEditStock = async () => {
    // Update formData with the symbol from inputValue
    const updatedFormData = { ...formData, symbol: inputValue.toUpperCase() };

    // Check if required fields are filled
    const requiredFields = [
      "symbol",
      "companyName",
      "type",
      "shares",
      "tradePrice",
    ];

    const isFormValid = requiredFields.every(
      (field) => updatedFormData[field] !== "" && updatedFormData[field] !== 0
    );

    if (!isFormValid) {
      customModal({
        showModal,
        title: "Error!",
        text: `Invalid!`,
        showConfirmButton: false,
        icon: ExclamationCircleIcon,
        iconBgColor: "bg-red-100",
        iconTextColor: "text-red-600",
        buttonBgColor: "bg-red-600",
        timer: 2000,
      });

      return;
    }

    setIsLoading(true);

    try {
      const result = await updateStockPortfolio(userId, updatedFormData);

      if (result) {
        setStock([...stock, { ...updatedFormData, id: result.id }]);
        resetForm();
      }
      customModal({
        showModal,
        title: "Success!",
        text: `Stock added successfully.`,
        showConfirmButton: false,
        icon: CheckIcon,
        iconBgColor: "bg-green-100",
        iconTextColor: "text-green-600",
        buttonBgColor: "bg-green-600",
        timer: 2000,
      });
    } catch (error) {
      customModal({
        showModal,
        title: "Error!",
        text: `There was an error adding stock. Please try again.`,
        showConfirmButton: false,
        icon: ExclamationCircleIcon,
        iconBgColor: "bg-red-100",
        iconTextColor: "text-red-600",
        buttonBgColor: "bg-red-600",
        timer: 2000,
      });

      console.error("Error adding stock:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Resets the form to initial state
  const resetForm = () => {
    setFormData({
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
    setInputValue("");
  };

  return (
    <div>
      <div className="pb-12 text-left">
        <h2 className="text-base font-semibold leading-7 text-gray-900">
          Edit New Stock
        </h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          Edit and update stock to user account.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6 text-left border-t border-gray-900/10">
        {/* Symbol */}
        <div className="sm:col-span-3 mt-6">
          <label
            htmlFor="symbol"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Search for Stock Symbol
          </label>
          <div className="mt-2 flex">
            <input
              type="text"
              id="symbol"
              name="symbol"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="text-sm leading-6 text-gray-900 font-normal block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm uppercase"
            />
            <button
              onClick={fetchStockData}
              className="ml-2 inline-flex justify-center items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
            >
              {isLoading ? (
                <div className="flex w-full justify-center align-middle gap-2">
                  <span>Searching</span>
                  <DotLoader />
                </div>
              ) : (
                "Search"
              )}
            </button>

            {/* {error === "No data available for the specified symbol." && (
          <p className="error_msg">{error}</p>
          )} */}
          </div>
        </div>
      </div>
      <form
        className="m-2"
        onSubmit={handleEditStock}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-12">
          <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6 text-left">
            {/* Company Name */}
            <div className="sm:col-span-3">
              <label
                htmlFor="companyName"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Company Name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  required
                  readOnly
                  className="text-sm leading-6 text-gray-900 font-normal block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            {/* Type */}
            <div className="sm:col-span-3">
              <label
                htmlFor="type"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Type
              </label>
              <div className="mt-2">
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  className="text-sm leading-6 text-gray-900 font-normal block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="Buy">Buy</option>
                  <option value="Sell">Sell</option>
                </select>
              </div>
            </div>
            {/* Shares */}
            <div className="sm:col-span-3">
              <label
                htmlFor="shares"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Shares
              </label>
              <div className="mt-2">
                <input
                  type="number"
                  id="shares"
                  name="shares"
                  value={formData.shares}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      shares: parseInt(e.target.value) || 0,
                    })
                  }
                  className="text-sm leading-6 text-gray-900 font-normal block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            {/* Trade Price */}
            <div className="sm:col-span-3">
              <label
                htmlFor="tradePrice"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Trade Price
              </label>
              <div className="relative mt-2 rounded-md shadow-sm">
                <CurrencyInput
                  decimalSeparator="."
                  prefix="$"
                  name="tradePrice"
                  value={formData.tradePrice}
                  decimalsLimit={2}
                  onValueChange={(value) => handleInputChange(value, 'tradePrice')}
                  required
                  className="text-sm leading-6 text-gray-900 font-normal block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <span
                    className="text-gray-500 sm:text-sm"
                    id="price-currency"
                  >
                    USD
                  </span>
                </div>
              </div>
            </div>
            {/* Market Price  */}
            <div className="sm:col-span-3">
              <label
                htmlFor="marketPrice"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Market Price
              </label>
              <div className="relative mt-2 rounded-md shadow-sm">
                <CurrencyInput
                  decimalSeparator="."
                  prefix="$"
                  name="marketPrice"
                  value={formData.marketPrice}
                  decimalsLimit={2}
                  onValueChange={(value) =>
                    handleInputChange(value, "marketPrice")
                  }
                  required
                  readOnly
                  className="text-sm leading-6 text-gray-900 font-normal block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <span
                    className="text-gray-500 sm:text-sm"
                    id="price-currency"
                  >
                    USD
                  </span>
                </div>
              </div>
            </div>
            {/* Trade Amount  */}
            <div className="sm:col-span-3">
              <label
                htmlFor="tradeAmount"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Trade Amount
              </label>
              <div className="relative mt-2 rounded-md shadow-sm">
                <CurrencyInput
                  decimalSeparator="."
                  prefix="$"
                  name="tradeAmount"
                  value={formData.tradeAmount}
                  decimalsLimit={2}
                  onValueChange={(value) =>
                    handleInputChange(value, "tradeAmount")
                  }
                  required
                  readOnly
                  className="text-sm leading-6 text-gray-900 font-normal block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <span
                    className="text-gray-500 sm:text-sm"
                    id="price-currency"
                  >
                    USD
                  </span>
                </div>
              </div>
            </div>
            {/* Value */}
            <div className="sm:col-span-3">
              <label
                htmlFor="value"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Value
              </label>
              <div className="relative mt-2 rounded-md shadow-sm">
                <CurrencyInput
                  decimalSeparator="."
                  prefix="$"
                  name="value"
                  value={formData.value}
                  decimalsLimit={2}
                  onValueChange={(value) => handleInputChange(value, "value")}
                  required
                  readOnly
                  className="text-sm leading-6 text-gray-900 font-normal block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <span
                    className="text-gray-500 sm:text-sm"
                    id="price-currency"
                  >
                    USD
                  </span>
                </div>
              </div>
            </div>
            {/* Profit Loss */}
            <div className="sm:col-span-3">
              <label
                htmlFor="profitLoss"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Profit/Loss (%)
              </label>
              <div className="mt-2">
                <input
                  type="number"
                  id="profitLoss"
                  name="profitLoss"
                  value={formData.profitLoss}
                  onChange={handleInputChange}
                  readOnly
                  className="text-sm leading-6 text-gray-900 font-normal block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            {/* Status */}
            <div className="sm:col-span-3">
              <label
                htmlFor="status"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Status
              </label>
              <div className="mt-2">
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  required
                >
                  <option value="Pending">Pending</option>
                  <option value="Outstanding">Outstanding</option>
                  <option value="Paid">Paid</option>
                  <option value="Sold">Sold</option>
                </select>
              </div>
            </div>
            {/* Trade Date */}
            <div className="sm:col-span-3">
              <label
                htmlFor="tradeDate"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Trade Date
              </label>
              <div className="mt-2">
                <input
                  type="date"
                  id="tradeDate"
                  name="tradeDate"
                  value={formData.tradeDate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tradeDate: e.target.value,
                    })
                  }
                  className="text-sm leading-6 text-gray-900 font-normal block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex space-x-6 justify-end">
          <button
            type="button"
            className="mt-3 inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            onClick={() => window.location.reload()}
          >
            Close
          </button>
          <button
            type="submit"
            className=" inline-flex justify-center items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
          >
            {isLoading ? (
              <div className="flex w-full justify-center align-middle gap-2">
                <span>Submitting</span>
                <DotLoader />
              </div>
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
