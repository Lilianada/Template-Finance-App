import React, { useEffect, useState } from "react";
import { ScaleIcon } from "@heroicons/react/24/outline";
import { getUserCashDeposits } from "../../../config/cashBalance";
import { formatNumber } from "../../../config/utils";

export default function PortfolioInfo({ initialUser }) {
  const userId = initialUser.uid;
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

  //Get Bonds Balance
  const getBondsBalance = async () => {
    //  const result = await getUserB
    
  }

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
      amount: amount,
    },
    {
      name: "IPOs balance",
      href: `/dashboard/registered_users/view/view_ipos_details/${userId}`,
      icon: ScaleIcon,
      amount: amount,
    },
    {
      name: "Terms balance",
      href: `/dashboard/registered_users/view/view_terms_details/${userId}`,
      icon: ScaleIcon,
      amount: amount,
    },
    {
      name: "Stocks balance",
      href: `/dashboard/registered_users/view/view_stocks_details/${userId}`,
      icon: ScaleIcon,
      amount: amount,
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
