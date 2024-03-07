import React from 'react';
import { ScaleIcon } from "@heroicons/react/24/outline";

const cards = [
    { name: "Total balance", href: "/", icon: ScaleIcon, amount: "$30,659.45" },
    { name: "Cash balance", href: "/", icon: ScaleIcon, amount: "$30,659.45" },
    { name: "Bonds balance", href: "/", icon: ScaleIcon, amount: "$30,659.45" },
    { name: "IPOs balance", href: "/", icon: ScaleIcon, amount: "$30,659.45" },
    { name: "Terms balance", href: "/", icon: ScaleIcon, amount: "$30,659.45" },
    { name: "Stocks balance", href: "/", icon: ScaleIcon, amount: "$30,659.45" },
  ];
  
export default function PortfolioInfo() {
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
                        {card.amount}
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
  )
}
