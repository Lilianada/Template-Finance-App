import React, { useEffect, useState } from "react";
import { ScaleIcon } from "@heroicons/react/24/outline";
import { getUserCashDeposits } from "../../../config/cashBalance";
import { convertToNumber, formatNumber } from "../../../config/utils";
import { getBondsHoldings, getUserBonds } from "../../../config/bonds";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../../config/firebase";

export default function PortfolioInf({ initialUser }) {
  const userId = initialUser.uid;
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState("30,659.45");
  const [cashBalance, setCashBalance] = useState("");
  const [bondsBalance, setBondsBalance] = useState("");
  const [iposBalance, setIposBalance] = useState("");
  const [termsBalance, setTermsBalance] = useState("");
  const [stocksBalance, setStocksBalance] = useState("");


  //Get Cash Balance
  useEffect(() => {
    getCashBalance();
    getBondsBalance();
    calculateTotalBondAmount();
  });

  const getCashBalance = async () => {
    const result = await getUserCashDeposits(userId);
    if (result === null) {
      setCashBalance("0.00");
    } else {
      const total = result.reduce(
        (acc, deposit) => acc + Number(deposit.amount),
        0
      );
      setCashBalance(total);
    }
  };

  useEffect(() => {
    const user = userId;
    if (!user) {
      setIsLoading(false);
      return;
    }

    // Reference to Firestore collections
    const bondsCollection = collection(db, "user", user, "bondHoldings");
    // const termsCollection = collection(db, "user", user, "fixedTermDeposits");
    // const iposCollection = collection(db, "user", user, "ipos");
    const cashDepositCollection = collection(db, "user", user, "cashDeposits");
    // const stocksCollection = collection(db, "user", user, "stocks");

    // Real-time updates for cash deposits
    // const unsubscribeCashDeposits = onSnapshot(
    //   cashDepositCollection,
    //   async (snapshot) => {
    //     const updatedCashDeposit = snapshot.docs.map((doc) => doc.data());
    //     const totalCashDepositAmount =
    //       await fetchAndCalculateTotalCashDepositAmount(
    //         user,
    //         updatedCashDeposit
    //       );

        // Ensure state is updated based on the calculated value
    //     setCashDeposits(updatedCashDeposit);
    //     setTotalDeposits(totalCashDepositAmount);
    //   }
    // );

    // Real-time updates for bonds
    const unsubscribeBonds = onSnapshot(bondsCollection, async (snapshot) => {
      const updatedBonds = snapshot.docs.map((doc) => doc.data());
      // setBondsBalance(updatedBonds);
      const totalBondAmount = await fetchAndCalculateTotalBondAmount(
        user,
        updatedBonds
      );
      setBondsBalance(totalBondAmount);
      console.log(totalBondAmount)
    });

    // Real-time updates for terms
    // const unsubscribeTerms = onSnapshot(termsCollection, async (snapshot) => {
    //   const updatedTerms = snapshot.docs.map((doc) => doc.data());
    //   setTerms(updatedTerms);
    //   const totalTermAmount = await fetchAndCalculateTotalTermAmount(
    //     user,
    //     updatedTerms
    //   );
    //   setTotalTermAmount(totalTermAmount);
    // });

    // Real-time updates for ipos
    // const unsubscribeIpos = onSnapshot(iposCollection, async (snapshot) => {
    //   const updatedIpos = snapshot.docs.map((doc) => doc.data());
    //   setIpos(updatedIpos);
    //   const totalIpoAmount = await fetchAndCalculateTotalIpoAmount(
    //     user,
    //     updatedIpos
    //   );
    //   setTotalIpoAmount(totalIpoAmount);
    // });

    // Real-time updates for shares
    // const unsubscribeShares = onSnapshot(stocksCollection, async (snapshot) => {
    //   const updatedShares = snapshot.docs.map((doc) => doc.data());
    //   setShares(updatedShares);
    //   const totalSharesAmount = await fetchAndCalculateTotalSharesAmount(
    //     user,
    //     updatedShares
    //   );
    //   setTotalShares(totalSharesAmount);
    // });

    setIsLoading(false);

    // Unsubscribe when the component unmounts
    return () => {
      unsubscribeBonds();
      // unsubscribeCashDeposits();
      // unsubscribeTerms();
      // unsubscribeIpos();
      // unsubscribeShares();
    };
  }, []);


  //Get Bonds Balance
  const getBondsBalance = async () => {
    let totalAmount = 0;
     const result = await getUserBonds(userId)
    if(result === null) {
      setBondsBalance("0.00")
    } else {
      result.forEach((bond) => {
        if (bond && bond.typeOfRequest === "buy") {
          totalAmount += convertToNumber(bond.currentValue);
          console.log(totalAmount)
          setBondsBalance(totalAmount)
        } else if (bond && bond.typeOfRequest === "sell") {
          totalAmount -= convertToNumber(bond.currentValue);
          setBondsBalance(totalAmount)
        }
      });
    }
  }
  
  const fetchAndCalculateTotalBondAmount = async (user, bonds) => {
    const bondData = await getBondsHoldings(user, bonds);
    return calculateTotalBondAmount(bondData);
  };

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

  const cards = [
    { name: "Total balance", icon: ScaleIcon, amount: "$30,659.45" },
    {
      name: "Cash balance",
      href: `/dashboard/registered_users/view/view_cash_details/${userId}`,
      icon: ScaleIcon,
      amount: cashBalance,
    },
    {
      name: "Bonds balance",
      href: `/dashboard/registered_users/view/view_bonds_details/${userId}`,
      icon: ScaleIcon,
      amount: bondsBalance,
    },
    {
      name: "IPOs balance",
      href: `/dashboard/registered_users/view/view_ipos_details/${userId}`,
      icon: ScaleIcon,
      amount: iposBalance,
    },
    {
      name: "Terms balance",
      href: `/dashboard/registered_users/view/view_terms_details/${userId}`,
      icon: ScaleIcon,
      amount: termsBalance,
    },
    {
      name: "Stocks balance",
      href: `/dashboard/registered_users/view/view_stocks_details/${userId}`,
      icon: ScaleIcon,
      amount: stocksBalance,
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
                  <a
                    href={card.href}
                    className="font-medium text-cyan-700 hover:text-cyan-900"
                  >
                    View breakdown
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
