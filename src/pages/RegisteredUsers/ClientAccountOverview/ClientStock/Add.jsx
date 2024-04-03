import React, { useEffect, useState } from 'react';
import { useModal } from '../../../../context/ModalContext';
import { getCurrentDate } from '../../../../config/utils';
import { addStockToPortfolio } from '../../../../config/stock';
import { CheckIcon, XMarkIcon, Exclamationicon } from "@heroicons/react/24/outline";
import axios from 'axios';
import { customModal } from '../../../../config/modalUtils';

export default function AddUserStock({open, setOpen, setStock, stock, userId}) {
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

      const stockApiKey = process.env.REACT_APP_STOCK_API_KEY;
      // Refactored function to fetch and update stock data
    
      const fetchStockData = async () => {
        setIsLoading(true);

        const options = {
          method: 'GET',
          url: 'https://real-time-finance-data.p.rapidapi.com/stock-quote',
          params: { symbol: `${inputValue}`, language: 'en' },
          headers: {
            'X-RapidAPI-Key': stockApiKey, // Replace with your RapidAPI Key
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
              text: `No data availabke for the specified symbol. Please try a differemt symbol..`,
              showConfirmButton: false,
              icon: Exclamationicon,
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
            icon: Exclamationicon,
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
          companyName: companyName
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
          profitLoss = (marketValue - tradeAmount) / tradeAmount * 100;
          console.log('sell',profitLoss, marketValue, tradeAmount);
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
    
      const handleAddStock = async () => {
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
                icon: Exclamationicon,
                iconBgColor: "bg-red-100",
                iconTextColor: "text-red-600",
                buttonBgColor: "bg-red-600",
                timer: 2000,
              });
            
          return;
        }
    
        setIsLoading(true);
       
        try {
          const result = await addStockToPortfolio(userId, updatedFormData);
    
          if (result) {
           
            setStock([...stock, { ...updatedFormData, id: result.id }]);
            resetForm();
          }
        } catch (error) {
            customModal({
                showModal,
                title: "Error!",
                text: `There was an error adding stock. Please try a differemt symbol..`,
                showConfirmButton: false,
                icon: Exclamationicon,
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
        setError("");
      };

  return (
    <div>
      
    </div>
  )
}
