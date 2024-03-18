import React, { useEffect, useRef, useState } from "react";
import { ScaleIcon } from "@heroicons/react/24/outline";
import { getUserCashDeposits } from "../../../config/cashBalance";
import { convertToNumber, formatNumber } from "../../../config/utils";
import { getBondsHoldings, getUserBonds } from "../../../config/bonds";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../../config/firebase";
import { getStockFromUserDB } from "../../../config/stock";
import { getUserIpos } from "../../../config/ipos";
import { getUserFixedTerm } from "../../../config/terms";
import { Link } from "react-router-dom";

export default function PortfolioInfo({ initialUser }) {
  const userId = initialUser.uid;
  const [totalBondAmount, setTotalBondAmount] = useState(0);
  const [totalTermAmount, setTotalTermAmount] = useState(0);
  const [totalIpoAmount, setTotalIpoAmount] = useState(0);
  const [totalShares, setTotalShares] = useState(0);
  const [totalDeposits, setTotalDeposits] = useState(0);
  const [balance , setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [bonds, setBonds] = useState([]);
  const [terms, setTerms] = useState([]);
  const [ipos, setIpos] = useState([]);
  const [cashDeposits, setCashDeposits] = useState([]);
  const [shares, setShares] = useState([]);

  // Convert a string representation of a number to a JavaScript number
  function convertToNumber(stringAmount) {
    // Check if the input is already a number, and if not, convert it
    if (typeof stringAmount === "string") {
      return parseFloat(stringAmount.replace(",", ""));
    } else if (typeof stringAmount === "number") {
      return stringAmount;
    }
    return 0;
  }

  useEffect(() => {
    const user = userId;
    if (!user) {
      setIsLoading(false);
      return;
    }

    // Reference to Firestore collections
    const bondsCollection = collection(db, "user", user, "bondHoldings");
    const termsCollection = collection(db, "user", user, "fixedTermDeposits");
    const iposCollection = collection(db, "user", user, "ipos");
    const cashDepositCollection = collection(db, "user", user, "cashDeposits");
    const stocksCollection = collection(db, "user", user, "stocks");

    // Real-time updates for cash deposits
    const unsubscribeCashDeposits = onSnapshot(
      cashDepositCollection,
      async (snapshot) => {
        const updatedCashDeposit = snapshot.docs.map((doc) => doc.data());
        const totalCashDepositAmount =
          await fetchAndCalculateTotalCashDepositAmount(
            user,
            updatedCashDeposit
          );

        // Ensure state is updated based on the calculated value
        setCashDeposits(updatedCashDeposit);
        setTotalDeposits(totalCashDepositAmount);
      }
    );

    // Real-time updates for bonds
    const unsubscribeBonds = onSnapshot(bondsCollection, async (snapshot) => {
      const updatedBonds = snapshot.docs.map((doc) => doc.data());
      setBonds(updatedBonds);
      const totalBondAmount = await fetchAndCalculateTotalBondAmount(
        user,
        updatedBonds
      );
      setTotalBondAmount(totalBondAmount);
    });

    // Real-time updates for terms
    const unsubscribeTerms = onSnapshot(termsCollection, async (snapshot) => {
      const updatedTerms = snapshot.docs.map((doc) => doc.data());
      setTerms(updatedTerms);
      const totalTermAmount = await fetchAndCalculateTotalTermAmount(
        user,
        updatedTerms
      );
      setTotalTermAmount(totalTermAmount);
    });

    // Real-time updates for ipos
    const unsubscribeIpos = onSnapshot(iposCollection, async (snapshot) => {
      const updatedIpos = snapshot.docs.map((doc) => doc.data());
      setIpos(updatedIpos);
      const totalIpoAmount = await fetchAndCalculateTotalIpoAmount(
        user,
        updatedIpos
      );
      setTotalIpoAmount(totalIpoAmount);
    });

    // Real-time updates for shares
    const unsubscribeShares = onSnapshot(stocksCollection, async (snapshot) => {
      const updatedShares = snapshot.docs.map((doc) => doc.data());
      setShares(updatedShares);
      const totalSharesAmount = await fetchAndCalculateTotalSharesAmount(
        user,
        updatedShares
      );
      setTotalShares(totalSharesAmount);
    });

    setIsLoading(false);

    // Unsubscribe when the component unmounts
    return () => {
      unsubscribeCashDeposits();
      unsubscribeBonds();
      unsubscribeTerms();
      unsubscribeIpos();
      unsubscribeShares();
    };
  }, []);

  // Calculate total balance
  useEffect(() => {
    const totalBalance =
      totalDeposits +
      totalBondAmount +
      totalTermAmount +
      totalIpoAmount +
      totalShares;
    setBalance(totalBalance);
  }, [
    totalDeposits,
    totalBondAmount,
    totalTermAmount,
    totalIpoAmount,
    totalShares,
  ]);

  // Assuming getCashDeposit, getStockFromUserDB, getUserIpos, and getBondsHoldings are async functions that fetch data from a database or an API.
  const fetchAndCalculateTotalCashDepositAmount = async (userId) => {
    try {
      // Fetch all necessary data
      const cashDepositData = await getUserCashDeposits(userId);
      const sharesData = await getStockFromUserDB(userId);
      const ipoData = await getUserIpos(userId);
      const bondData = await getBondsHoldings(userId);
      // Calculate total cash deposits amount including proceeds from sales
      const totalCashDeposits = await calculateTotalCashBalance(
        cashDepositData,
        sharesData,
        ipoData,
        bondData
      );

      return totalCashDeposits;
    } catch (error) {
      console.error("Error calculating total cash deposit amount:", error);
      return 0; // Return 0 or handle the error as appropriate
    }
  };

  // Fetch and calculate the total shares amount
  const fetchAndCalculateTotalSharesAmount = async (user, shares) => {
    const sharesData = await getStockFromUserDB(user, shares);
    return calculateTotalSharesAmount(sharesData);
  };

  // Fetch and calculate the total bond amount
  const fetchAndCalculateTotalBondAmount = async (user, bonds) => {
    const bondData = await getBondsHoldings(user, bonds);
    return calculateTotalBondAmount(bondData);
  };

  // Fetch and calculate the total term amount
  const fetchAndCalculateTotalTermAmount = async (user, terms) => {
    const termData = await getUserFixedTerm(user, terms); // Use your function to get term data
    return calculateTotalTermAmount(termData);
  };

  // Fetch and calculate the total IPO amount
  const fetchAndCalculateTotalIpoAmount = async (user, ipos) => {
    const ipoData = await getUserIpos(user, ipos); // Use your function to get IPO data
    return calculateTotalIpoAmount(ipoData);
  };

  // Calculate the total shares amount
  const calculateTotalSharesAmount = (shares) => {
    let totalAmount = 0;

    if (shares) {
      shares.forEach((share) => {
        if (share && share.type === "Buy") {
          totalAmount += convertToNumber(share.value);
        } else if (share && share.type === "Sell") {
          totalAmount -= convertToNumber(share.value);
          console.log("totalAmount", totalAmount);
        }
      });
    }

    return totalAmount;
  };

  // Revised function to include sales from shares, IPOs, bonds, and cash deposit withdrawals
  const calculateTotalCashBalance = async (
    cashDepositData = [],
    sharesData = [],
    ipoData = [],
    bondData = []
  ) => {
    // Ensure that each data set is an array, even if the input is null or undefined
    cashDepositData = cashDepositData || [];
    sharesData = sharesData || [];
    ipoData = ipoData || [];
    bondData = bondData || [];
    let cashBalance = 0; // Renamed from totalCashDeposits for clarity

    // Add proceeds from cleared cash deposits
    const updateCashFromDeposits = (data) => {
      data.forEach((item) => {
        if (
          item &&
          item.status &&
          item.status.trim().toUpperCase() === "CLEARED"
        ) {
          cashBalance += convertToNumber(item.amount);
        }
      });
    };

    // Add proceeds from selling IPOs
    const updateCashFromIpoSales = (data) => {
      data.forEach((item) => {
        if (item && item.type && item.type.trim().toUpperCase() === "SELL") {
          cashBalance +=
            convertToNumber(item.numberOfShares) *
            convertToNumber(item.sharePrice);
        }
      });
    };

    // Add proceeds from selling shares
    const updateCashFromShareSales = (data) => {
      data.forEach((item) => {
        if (item && item.type && item.type.trim().toUpperCase() === "SELL") {
          cashBalance += convertToNumber(item.tradeAmount);
        }
      });
    };

    // Add proceeds from selling bonds
    const updateCashFromBondSales = (data) => {
      data.forEach((item) => {
        if (
          item &&
          item.typeOfRequest &&
          item.typeOfRequest.trim().toUpperCase() === "SELL"
        ) {
          cashBalance += convertToNumber(item.currentValue);
        }
      });
    };

    // Update cash balance for each type of transaction
    updateCashFromDeposits(cashDepositData);
    updateCashFromShareSales(sharesData);
    updateCashFromIpoSales(ipoData);
    updateCashFromBondSales(bondData);

    return cashBalance;
  };

  // Calculate the total bond amount
  const calculateTotalBondAmount = (bonds) => {
    let totalAmount = 0;

    if (bonds) {
      bonds.forEach((bond) => {
        if (bond && bond.typeOfRequest === "buy") {
          totalAmount += convertToNumber(bond.currentValue);
        } else if (bond && bond.typeOfRequest === "sell") {
          totalAmount -= convertToNumber(bond.currentValue);
        }
      });
    }

    return totalAmount;
  };

  // Calculate the total term amount
  const calculateTotalTermAmount = (terms) => {
    let totalAmount = 0;

    if (terms) {
      terms.forEach((term) => {
        if (term && term.type === "deposit") {
          totalAmount += convertToNumber(term.principalAmount);
        } else if (term && term.type === "withdrawal") {
          totalAmount -= convertToNumber(term.principalAmount);
        }
      });
    }

    return totalAmount;
  };

  // Calculate the total IPO amount
  const calculateTotalIpoAmount = (ipos) => {
    let totalAmount = 0;

    if (Array.isArray(ipos) && ipos.length > 0) {
      ipos.forEach((ipo) => {
        const numberOfShares = convertToNumber(ipo.numberOfShares);
        const sharePrice = convertToNumber(ipo.sharePrice);

        if (ipo && ipo.type.trim().toUpperCase() === "INVEST") {
          totalAmount += numberOfShares * sharePrice;
        } else if (ipo && ipo.type.trim().toUpperCase() === "SELL") {
          totalAmount -= numberOfShares * sharePrice;
        }
      });
    }

    return totalAmount;
  };

  const cards = [
    {
      name: "Cash balance",
      href: `/dashboard/registered_users/view/view_cash_details/${userId}`,
      icon: ScaleIcon,
      amount: totalDeposits,
    },
    {
      name: "Bonds balance",
      href: `/dashboard/registered_users/view/view_bonds_details/${userId}`,
      icon: ScaleIcon,
      amount: totalBondAmount,
    },
    {
      name: "IPOs balance",
      href: `/dashboard/registered_users/view/view_ipos_details/${userId}`,
      icon: ScaleIcon,
      amount: totalIpoAmount,
    },
    {
      name: "Terms balance",
      href: `/dashboard/registered_users/view/view_terms_details/${userId}`,
      icon: ScaleIcon,
      amount: totalTermAmount,
    },
    {
      name: "Stocks balance",
      href: `/dashboard/registered_users/view/view_stocks_details/${userId}`,
      icon: ScaleIcon,
      amount: totalShares,
    },
  ];

  return (
    <div className="py-6 bg-gray-50 px-4 my-8 rounded-md shadow">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-left">
        <h2 className="text-lg font-semibold leading-6 text-gray-900 pb-4">
          Account Overview
        </h2>
        <div className="py-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* Card */}
          <div className="overflow-hidden rounded-lg bg-white shadow" >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="w-0 flex-1">
                    <dl>
                      <dt className="truncate text-sm font-medium text-gray-500">
                        Total Balance
                      </dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">
                          ${formatNumber(balance)}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <div className="font-medium text-cyan-700 hover:text-cyan-900"
                  >
                    Nothing to view
                  </div>
                </div>
              </div>
            </div>
          {cards.map((card, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-lg bg-white shadow"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="w-0 flex-1">
                    <dl>
                      <dt className="truncate text-sm font-medium text-gray-500">
                        {card.name}
                      </dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">
                          ${formatNumber(card.amount)}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link
                    to={card.href}
                    className="font-medium text-cyan-700 hover:text-cyan-900"
                  >
                    View breakdown
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
