import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ScaleIcon } from "@heroicons/react/24/outline";
import { convertToNumber, formatNumber } from "../../../config/utils";
import { Link } from "react-router-dom";
import { fetchUserTerms } from "../../../store/terms/termsSlice";
import { fetchUserBonds } from "../../../store/bonds/bondsSlice";
import { fetchUserIpos } from "../../../store/ipos/iposSlice";
import { fetchUserCashDeposits } from "../../../store/cash/cashSlice";
import { fetchUserStocks } from "../../../store/stocks/stocksSlice";

export default function AccountOverview({ initialUser }) {
  const userId = initialUser.uid;
  const dispatch = useDispatch();

  const [totalBondAmount, setTotalBondAmount] = useState(0);
  const [totalTermAmount, setTotalTermAmount] = useState(0);
  const [totalIpoAmount, setTotalIpoAmount] = useState(0);
  const [totalShares, setTotalShares] = useState(0);
  const [totalDeposits, setTotalDeposits] = useState(0);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const fetchUserData = () => {
      try {
        dispatch(fetchUserBonds(userId));
        dispatch(fetchUserTerms(userId));
        dispatch(fetchUserIpos(userId));
        dispatch(fetchUserCashDeposits(userId));
        dispatch(fetchUserStocks(userId));
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [dispatch, userId]);

  const bonds = useSelector((state) => state.bonds.userBonds);
  const terms = useSelector((state) => state.terms.userTerms);
  const ipos = useSelector((state) => state.ipos.userIpos);
  const cashDeposits = useSelector(
    (state) => state.cashDeposits.userCashDeposits
  );
  const stocks = useSelector((state) => state.stocks.userStocks);

  useEffect(() => {
    if (bonds && bonds.length > 0) {
      setTotalBondAmount(calculateTotalBondAmount(bonds));
    }
  }, [bonds]);

  useEffect(() => {
    if (terms && terms.length > 0) {
      setTotalTermAmount(calculateTotalTermAmount(terms));
    }
  }, [terms]);

  useEffect(() => {
    if (ipos && ipos.length > 0) {
      setTotalIpoAmount(calculateTotalIpoAmount(ipos));
    }
  }, [ipos]);

  useEffect(() => {
    if (cashDeposits && cashDeposits.length > 0) {
      setTotalDeposits(calculateTotalCashBalance(cashDeposits));
    }
  }, [cashDeposits]);

  useEffect(() => {
    if (stocks && stocks.length > 0) {
      setTotalShares(calculateTotalSharesAmount(stocks));
    }
  }, [stocks]);

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
  const calculateTotalCashBalance = (
    cashDepositData = [],
    sharesData = [],
    ipoData = [],
    bondData = []
  ) => {
    let cashBalance = 0;

    // Calculate total cash deposits
    cashDepositData.forEach((deposit) => {
      if (deposit.status.trim().toUpperCase() === "CLEARED") {
        cashBalance += convertToNumber(deposit.amount);
      }
    });

    // Calculate cash balance from share sales
    sharesData.forEach((share) => {
      if (share.type.trim().toUpperCase() === "SELL") {
        cashBalance += convertToNumber(share.tradeAmount);
      }
    });

    // Calculate cash balance from IPO sales
    ipoData.forEach((ipo) => {
      if (ipo.type.trim().toUpperCase() === "SELL") {
        cashBalance +=
          convertToNumber(ipo.numberOfShares) * convertToNumber(ipo.sharePrice);
      }
    });

    // Calculate cash balance from bond sales
    bondData.forEach((bond) => {
      if (bond.typeOfRequest.trim().toUpperCase() === "SELL") {
        cashBalance += convertToNumber(bond.currentValue);
      }
    });

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
