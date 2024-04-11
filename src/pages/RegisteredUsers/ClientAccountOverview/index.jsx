import React, { useEffect, useState } from "react";
import { ArrowLeftIcon, ScaleIcon } from "@heroicons/react/24/outline";
import { convertToNumber, formatNumber } from "../../../config/utils";
import { Link } from "react-router-dom";
import { getUserCashDeposits } from "../../../config/cashBalance";
import { getUserFixedTerm } from "../../../config/terms";
import { getUserBonds } from "../../../config/bonds";
import { getStockFromUserDB } from "../../../config/stock";
import { getUserIpos } from "../../../config/ipos";

export default function AccountOverview({ initialUser }) {
  const userId = initialUser.uid;

  const [totalBondAmount, setTotalBondAmount] = useState(0);
  const [totalTermAmount, setTotalTermAmount] = useState(0);
  const [totalIpoAmount, setTotalIpoAmount] = useState(0);
  const [totalShares, setTotalShares] = useState(0);
  const [totalDeposits, setTotalDeposits] = useState(0);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const cashDeposits = await getUserCashDeposits(userId);
        const terms = await getUserFixedTerm(userId);
        const bonds = await getUserBonds(userId);
        const ipos = await getUserIpos(userId);
        const stocks = await getStockFromUserDB(userId);

        calculateTotalDeposits(cashDeposits);
        calculateTotalBonds(bonds);
        calculateTotalTerms(terms);
        calculateTotalIpos(ipos);
        calculateTotalShares(stocks);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [userId]);

  // Calculate total deposits
  const calculateTotalDeposits = (deposits) => {
    let total = 0;
    deposits.forEach((deposit) => {
      total += convertToNumber(deposit.amount);
    });
    setTotalDeposits(total);
  };

  // Calculate total bonds
  const calculateTotalBonds = (bonds) => {
    let total = 0;
    bonds.forEach((bond) => {
      if (bond.typeOfRequest.trim().toUpperCase() === "BUY") {
        total += convertToNumber(bond.currentValue);
      } else if (bond.typeOfRequest.trim().toUpperCase() === "SELL") {
        total -= convertToNumber(bond.currentValue);
      }
    });
    setTotalBondAmount(total);
  };

  // Calculate total terms
  const calculateTotalTerms = (terms) => {
    let total = 0;
    terms.forEach((term) => {
      if (term.type.trim().toUpperCase() === "DEPOSIT") {
        total += convertToNumber(term.principalAmount);
      } else if (term.type.trim().toUpperCase() === "WITHDRAWAL") {
        total -= convertToNumber(term.principalAmount);
      }
    });
    setTotalTermAmount(total);
  };

  // Calculate total IPOs
  const calculateTotalIpos = (ipos) => {
    let total = 0;
    ipos.forEach((ipo) => {
      const numberOfShares = convertToNumber(ipo.numberOfShares);
      const sharePrice = convertToNumber(ipo.sharePrice);
      if (ipo.type.trim().toUpperCase() === "INVEST") {
        total += numberOfShares * sharePrice;
      } else if (ipo.type.trim().toUpperCase() === "SELL") {
        total -= numberOfShares * sharePrice;
      }
    });
    setTotalIpoAmount(total);
  };

  // Calculate total shares
  const calculateTotalShares = (shares) => {
    let total = 0;
    shares.forEach((share) => {
      if (share.type.trim().toUpperCase() === "BUY") {
        total += convertToNumber(share.value);
      } else if (share.type.trim().toUpperCase() === "SELL") {
        total -= convertToNumber(share.value);
      }
    });
    setTotalShares(total);
  };

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
          <div className="overflow-hidden rounded-lg bg-white shadow">
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
                <div className="font-medium text-indigo-700 hover:text-indigo-900">
                  Total value of all accounts
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
                    className="font-medium text-indigo-700 hover:text-indigo-900"
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
