import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { RadioGroup } from "@headlessui/react";
import {
  CheckIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import {
  cryptoExperiences,
  cryptoInvestments,
  educationExperience,
  familyMembers,
  financialStatus,
  investmentAmount,
  investmentWindow,
  netAnnualIncome,
  occupation,
  plannedInvestments,
  primaryPurpose,
  purposeOfTrading,
  riskReward,
  stockExperiences,
  stockInvestents,
  tradingExperience,
  tradingKnowledgeAssessment,
  tradingStrategy,
  investmentExperience,
  investmentKnowledge,
  investmentStrategy,
  currency,
  liquidNetWorth,
  totalNetWorth,
  riskProfile,
  relevantInvestment,
} from "./data";
import { getUserKyc, updateUserKyc } from "../../../config/user";
import DotLoader from "../../../components/DotLoader";
import { useModal } from "../../../context/ModalContext";
import { customModal } from "../../../utils/modalUtils";

function EditKyc() {
  const { userId } = useParams();
  const { showModal, hideModal } = useModal();
  const [formData, setFormData] = useState({
    eduExperience: "",
    purpose: "",
    tradeExperience: "",
    investments: "",
    investWindow: "",
    tradingKnowledge: "",
    tradeKnowledge: "",
    purposeTrading: "",
    financialStats: [],
    stocksInvestment: "",
    stockExperience: "",
    cryptoExperience: "",
    cryptoInvestment: "",
    leverageExperience: "",
    leverageInvestments: "",
    job: "",
    employerDets: "",
    netIncome: "",
    assets: "",
    investAmount: "",
    risk: {
      name: "",
      limit: "",
    },
    familyAssessment: [],

    investExperience: "",
    investKnowledge: "",
    investStrategy: "",
    riskProfile: "",
    relevantInvestment: "",
    selectCurrency: "",
    liquidNetWorth: "",
    totalNet: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchKycDetails = async () => {
      try {
        const details = await getUserKyc(userId);
        if (details) {
          setFormData((prevDetails) => ({
            ...prevDetails,
            eduExperience: details.eduExperience || [],
            purpose: details.purpose || "",
            tradeExperience: details.tradeExperience || "",
            investments: details.investments || "",
            investWindow: details.investWindow || "",
            tradeKnowledge: details.tradeKnowledge || [],
            tradeStrategy: details.tradeStrategy || "",
            purposeTrading: details.purposeTrading || "",
            financialStats: details.financialStats || [],
            job: details.job || "",
            employerDets: details.employerDets || "",
            stocksInvestment: details.stocksInvestment || "",
            stockExperience: details.stockExperience || "",
            cryptoExperience: details.cryptoExperience || "",
            cryptoInvestment: details.cryptoInvestment || "",
            leverageExperience: details.leverageExperience || "",
            leverageInvestments: details.leverageInvestments || "",
            netIncome: details.netIncome || "",
            assets: details.assets || "",
            investAmount: details.investAmount || "",
            risk: details.risk || { name: "", limit: "" },
            familyAssessment: details.familyAssessment || [],

            investExperience: details.investExperience || "",
            investKnowledge: details.investKnowledge || "",
            investStrategy: details.investStrategy || "",
            riskProfile: details.riskProfile || "",
            relevantInvestment: details.relevantInvestment || "",
            selectCurrency: details.selectCurrency || "",
            liquidNetWorth: details.liquidNetWorth || "",
            totalNet: details.totalNet || "",
          }));
        } else {
          setFormData({
            eduExperience: [],
            purpose: "",
            tradeExperience: "",
            investments: "",
            investWindow: "",
            tradeKnowledge: [],
            tradeStrategy: "",
            purposeTrading: "",
            financialStats: [],
            stocksInvestment: "",
            stockExperience: "",
            cryptoExperience: "",
            cryptoInvestment: "",
            leverageExperience: "",
            leverageInvestments: "",
            job: "",
            employerDets: "",
            netIncome: "",
            assets: "",
            investAmount: "",
            risk: {
              name: "",
              limit: "",
            },
            familyAssessment: [],

            investExperience: "",
            investKnowledge: "",
            investStrategy: "",
            riskProfile: "",
            relevantInvestment: "",
            selectCurrency: "",
            liquidNetWorth: "",
            totalNet: "",
          });
        }
      } catch (err) {
        console.error("Error fetching KYC details:", err);
      }
    };

    if (userId) {
      fetchKycDetails();
    }
  }, []);

  // Handle field changes for both single and multiple value fields
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    if (type === "checkbox") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: checked
          ? [...prevData[name], value]
          : prevData[name].filter((item) => item !== value),
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  // Example submission handler
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const response = await updateUserKyc(userId, formData); // Await the response from the updateUserKyc function

    if (response.success) {
      // Show a success message if KYC details were successfully updated
      customModal({
        showModal,
        title: "Success!",
        text: "KYC details updated successfully.",
        showConfirmButton: false,
        icon: CheckIcon,
        iconBgColor: "bg-green-100",
        iconTextColor: "text-green-600",
        buttonBgColor: "bg-green-600",
        timer: 2000,
        onClose: hideModal,
      });
    } else {
      // Handle the error case
      console.error("Error updating KYC details:", response.error);
      customModal({
        showModal,
        title: "Error!",
        text: `There was a problem updating KYC details: ${response.error}`,
        showConfirmButton: false,
        icon: ExclamationTriangleIcon,
        iconBgColor: "bg-red-100",
        iconTextColor: "text-red-600",
        buttonBgColor: "bg-red-600",
        onClose: hideModal,
        timer: 3000,
      });
    }

    setIsSubmitting(false);
  };

  return (
    <div className="bg-gray-50 py-6 px-4 lg:px-8 my-8 rounded-md shadow text-left">
      <div className="">
        <div className="px-4 sm:px-0 text-left">
          <h3 className="text-lg font-semibold leading-7 text-gray-900">
            Know Your Customer (KYC)
          </h3>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
            Add or edit client's KYC.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* Form sections */}

          <div className="space-y-4 grid gap-4">
            {/* Your Goal */}
            <section aria-labelledby="plan-heading">
              <div className="shadow sm:overflow-hidden sm:rounded-md">
                <div className="space-y-6 bg-white p-7 sm:p-6">
                  <div>
                    <h2
                      id="plan-heading"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Your goal
                    </h2>
                  </div>

                  <div className=" lg:w-[720px] sm:w-full flex flex-col gap-4">
                    {/* Purpose of trade */}
                    <div className="space-y-2">
                      <p className="mt-1 text-sm text-gray-500">
                        Primary purpose of trading with us
                      </p>
                      <select
                        name="purpose"
                        value={formData.purpose}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                      >
                        <option value="">Select your primary purpose</option>
                        {primaryPurpose.map((purpose, index) => (
                          <option value={purpose} key={index}>
                            {purpose}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* planned investments */}
                    <div className="space-y-2">
                      <p className="mt-1 text-sm text-gray-500">
                        Planned investments
                      </p>
                      <select
                        name="investments"
                        value={formData.investments}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                      >
                        <option value="">
                          Select your planned investments
                        </option>
                        {plannedInvestments.map((investment, index) => (
                          <option value={investment} key={index}>
                            {investment}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <p className="mt-1 text-sm text-gray-500">
                        Investement Strategy
                      </p>
                      <div className="mt-2">
                        <select
                          name="investStrategy"
                          value={formData.investStrategy}
                          onChange={handleChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                        >
                          <option value="">
                            Select your investment strategy
                          </option>
                          {investmentStrategy.map((investment, index) => (
                            <option value={investment} key={index}>
                              {investment}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/*Investment window */}
                    <div className="space-y-2">
                      <p className="mt-1 text-sm text-gray-500">
                        Investment window
                      </p>
                      <select
                        name="investWindow"
                        value={formData.investWindow}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                      >
                        <option value="">Select your investment window</option>
                        {investmentWindow.map((investment, index) => (
                          <option value={investment} key={index}>
                            {investment}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Stock investing experience */}
            <section aria-labelledby="plan-heading">
              <div className="shadow sm:overflow-hidden sm:rounded-md">
                <div className="space-y-6 bg-white p-7 sm:p-6">
                  <div>
                    <h2
                      id="plan-heading"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Stocks Investing Experience
                    </h2>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="space-y-2">
                      <p className="mt-1 text-sm text-gray-500">
                        Over the last year, how many times have you invested in
                        stocks and/or ETFs?
                      </p>
                      {stockExperiences.map((investment, index) => (
                        <div key={index}>
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              name="stockExperience"
                              value={investment}
                              checked={formData.stockExperience === investment}
                              onChange={handleChange}
                              className="form-radio h-4 w-4 text-teal-600 border-gray-300 focus:ring-teal-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">
                              {investment}
                            </span>
                          </label>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <p className="mt-1 text-sm text-gray-500">
                        In the last year, how much have you invested in stocks
                        and/or ETFs?
                      </p>
                      {stockInvestents.map((investment, index) => (
                        <div key={index}>
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              name="stocksInvestment"
                              value={investment}
                              checked={
                                formData.stocksInvestment.includes(
                                  investment
                                ) || false
                              }
                              onChange={handleChange}
                              className="form-radio h-4 w-4 text-teal-600 border-gray-300 focus:ring-teal-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">
                              {investment}
                            </span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Crypto investing experience */}
            <section aria-labelledby="plan-heading">
              <div className="shadow sm:overflow-hidden sm:rounded-md">
                <div className="space-y-6 bg-white p-7 sm:p-6">
                  <div>
                    <h2
                      id="plan-heading"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Crypto Investing Experience
                    </h2>
                  </div>
                  <div className=" lg:w-[720px] sm:w-full flex flex-col gap-4">
                    <div className="space-y-2">
                      <p className="mt-1 text-sm text-gray-500">
                        Over the last year, how many times have you invested in
                        crypto?
                      </p>
                      {cryptoExperiences.map((investment, index) => (
                        <div key={index}>
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              name="cryptoExperience"
                              value={investment}
                              checked={formData.cryptoExperience.includes(
                                investment
                              )}
                              onChange={handleChange}
                              className="form-radio h-4 w-4 text-teal-600 border-gray-300 focus:ring-teal-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">
                              {investment}
                            </span>
                          </label>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <p className="mt-1 text-sm text-gray-500">
                        How much did you invest?
                      </p>
                      {cryptoInvestments.map((investment, index) => (
                        <div key={index}>
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              name="cryptoInvestment"
                              value={investment}
                              checked={
                                formData.cryptoInvestment.includes(
                                  investment
                                ) || false
                              }
                              onChange={handleChange}
                              className="form-radio h-4 w-4 text-teal-600 border-gray-300 focus:ring-teal-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">
                              {investment}
                            </span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Leverage investing experience */}
            <section aria-labelledby="plan-heading">
              <div className="shadow sm:overflow-hidden sm:rounded-md">
                <div className="space-y-6 bg-white p-7 sm:p-6">
                  <div>
                    <h2
                      id="plan-heading"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Leverage Investing Experience
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      The following questions relate to your leveraged
                      investment experience (CFDS, futures, options, forex,
                      margin trading, etc.) over the last year.
                    </p>
                  </div>
                  <div className=" lg:w-[720px] sm:w-full flex flex-col gap-4">
                    <div className="space-y-2">
                      <p className="mt-1 text-sm text-gray-500">
                        How many of these types of investments have you made?
                      </p>
                      {["1-10", "10-40", "40 plus"].map((investment, index) => (
                        <div key={index}>
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              name="leverageExperience"
                              value={investment}
                              checked={formData.leverageExperience.includes(
                                investment
                              )}
                              onChange={handleChange}
                              className="form-radio h-4 w-4 text-teal-600 border-gray-300 focus:ring-teal-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">
                              {investment}
                            </span>
                          </label>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <p className="mt-1 text-sm text-gray-500">
                        In the last year, how much have you invested in ?
                      </p>
                      {["$1-$500", "$500-$2000", "$2000 plus"].map(
                        (investment, index) => (
                          <div key={index}>
                            <label className="inline-flex items-center">
                              <input
                                type="radio"
                                name="leverageInvestments"
                                value={investment}
                                checked={formData.leverageInvestments.includes(
                                  investment
                                )}
                                onChange={handleChange}
                                className="form-radio h-4 w-4 text-teal-600 border-gray-300 focus:ring-teal-500"
                              />
                              <span className="ml-2 text-sm text-gray-700">
                                {investment}
                              </span>
                            </label>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Trading Knowledge and Experience */}
            <section aria-labelledby="plan-heading">
              <div className="shadow sm:overflow-hidden sm:rounded-md">
                <div className="space-y-6 bg-white lg:p-7 sm:p-6">
                  <div>
                    <h2
                      id="plan-heading"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Trading Knowldge and Experience
                    </h2>
                  </div>
                  <div className=" lg:w-[720px] sm:w-full flex flex-col gap-4">
                    {/* Trading Experience */}
                    <div className="space-y-2">
                      <p className="mt-1 text-sm text-gray-500">
                        Are you accustomed to making your own financial
                        decisions?
                      </p>
                      <select
                        name="investExperience"
                        value={formData.investExperience}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                      >
                        <option value="">
                          Select your investment experience
                        </option>
                        {investmentExperience.map((investment, index) => (
                          <option value={investment} key={index}>
                            {investment}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <p className="mt-1 text-sm text-gray-500">
                        Please pick any of the following that matches your
                        knowledge.
                      </p>
                      <select
                        name="investKnowledge"
                        value={formData.investKnowledge}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                      >
                        <option value="">
                          Select your investment knowledge
                        </option>
                        {investmentKnowledge.map((investment, index) => (
                          <option value={investment} key={index}>
                            {investment}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <p className="mt-1 text-sm text-gray-500">
                        Trading Experience
                      </p>
                      <select
                        name="tradeExperience"
                        value={formData.tradeExperience}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                      >
                        <option value="">Select your trading experience</option>
                        {tradingExperience.map((experience, index) => (
                          <option value={experience} key={index}>
                            {experience}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <p className="mt-1 text-sm text-gray-500">
                        Please tick any of the following investments you
                        consider yourself to be familiar with from your previous
                        investment experience.
                      </p>
                      {relevantInvestment.map((item, index) => (
                        <div key={index}>
                          <label className="inline-flex items-center">
                            <input
                              type="checkbox"
                              name="relevantInvestment"
                              value={item}
                              checked={formData.relevantInvestment.includes(
                                item
                              )}
                              onChange={handleChange}
                              className="form-checkbox h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">
                              {item}
                            </span>
                          </label>
                        </div>
                      ))}
                    </div>

                    {/* Trading education experience */}
                    <div className="space-y-2">
                      <p className="mt-1 text-sm text-gray-500">
                        What's your investment education experience regarding
                        leveraged products?(CDs, Futures, Options, Forex, Margin
                        trade and ETF). Please select one or more relevant
                        answers.
                      </p>
                      {educationExperience.map((experience, index) => (
                        <div key={index}>
                          <label className="inline-flex items-center">
                            <input
                              type="checkbox"
                              name="eduExperience"
                              value={experience}
                              checked={formData.eduExperience.includes(
                                experience
                              )}
                              onChange={handleChange}
                              className="form-checkbox h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">
                              {experience}
                            </span>
                          </label>
                        </div>
                      ))}
                    </div>

                    {/*Trading knowledge assessment  */}
                    <div className="space-y-2">
                      <p className="mt-1 text-sm text-gray-500">
                        We would like to assess your level of knowledge of
                        complex derivatives and trading with leverage
                      </p>
                      {tradingKnowledgeAssessment.map((investment, index) => (
                        <div key={index}>
                          <label className="inline-flex items-center">
                            <input
                              type="checkbox"
                              name="tradeKnowledge"
                              value={investment}
                              checked={formData.tradeKnowledge.includes(
                                investment
                              )}
                              onChange={handleChange}
                              className="form-checkbox h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">
                              {investment}
                            </span>
                          </label>
                        </div>
                      ))}
                    </div>

                    {/* Trading strategy */}
                    <div className="space-y-2">
                      <p className="mt-1 text-sm text-gray-500">
                        How long do you plan to leave your positions open?
                      </p>
                      <select
                        name="tradeStrategy"
                        value={formData.tradeStrategy}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                      >
                        <option value="">Select your trading strategy</option>
                        {tradingStrategy.map((strategy, index) => (
                          <option value={strategy} key={index}>
                            {strategy}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Purpose of trading */}
                    <div className="space-y-2">
                      <p className="mt-1 text-sm text-gray-500">
                        What best describes your primary purpose of trading with
                        us?
                      </p>
                      <select
                        name="purposeTrading"
                        value={formData.purposeTrading}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                      >
                        <option value="">Select your purpose of trading</option>
                        {purposeOfTrading.map((purpose, index) => (
                          <option value={purpose} key={index}>
                            {purpose}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Investment amount */}
                    <div className="space-y-2">
                      <p className="mt-1 text-sm text-gray-500">
                        How much are you willing to invest?
                      </p>
                      <select
                        name="investAmount"
                        value={formData.investAmount}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                      >
                        <option value="">
                          Select how much you are willing to invest
                        </option>
                        {investmentAmount.map((attitude, index) => (
                          <option value={attitude} key={index}>
                            {attitude}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <p className="mt-1 text-sm text-gray-500">
                        Please select one of the following which matches your
                        circumstances.
                      </p>
                      <select
                        name="riskProfile"
                        value={formData.riskProfile}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                      >
                        <option value="">Select your risk profile</option>
                        {riskProfile.map((item, index) => (
                          <option value={item} key={index}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Risk reward */}
                    <div className="space-y-2">
                      <p className="mt-1 text-sm text-gray-500">
                        Which risk/reward scenario best describes your annual
                        investments expectations with us?
                      </p>
                      <RadioGroup
                        value={formData.risk.name}
                        onChange={(selectedName) => {
                          const selectedRisk = riskReward.find(
                            (risk) => risk.name === selectedName
                          );
                          setFormData((prevFormData) => ({
                            ...prevFormData,
                            risk: selectedRisk || { name: "", limit: "" },
                          }));
                        }}
                      >
                        <div className="space-y-4">
                          {riskReward.map((option, index) => (
                            <RadioGroup.Option key={index} value={option.name}>
                              {({ checked }) => (
                                <div
                                  className={`relative border p-4 flex cursor-pointer focus:outline-none rounded-lg ${
                                    checked
                                      ? "bg-teal-50 border-teal-200 z-10"
                                      : "border-gray-200"
                                  }`}
                                >
                                  <span
                                    className={`h-4 w-4 mt-0.5 cursor-pointer rounded-full border flex items-center justify-center ${
                                      checked
                                        ? "bg-teal-600 border-transparent"
                                        : "bg-white border-gray-300"
                                    }`}
                                    aria-hidden="true"
                                  >
                                    <span className="rounded-full bg-white w-1.5 h-1.5" />
                                  </span>
                                  <div className="ml-3 flex flex-col lg:flex-row gap-4 w-full">
                                    <RadioGroup.Label
                                      as="span"
                                      className="block text-sm font-medium text-gray-900"
                                    >
                                      {option.name}
                                    </RadioGroup.Label>
                                    <RadioGroup.Description
                                      as="span"
                                      className="block text-sm text-gray-500"
                                    >
                                      {option.limit}
                                    </RadioGroup.Description>
                                  </div>
                                </div>
                              )}
                            </RadioGroup.Option>
                          ))}
                        </div>
                      </RadioGroup>
                    </div>

                    {/*Family Assessment */}
                    <div className="space-y-2">
                      <p className="mt-1 text-sm text-gray-500">
                        Does any of the following apply to you? <br /> I or any
                        of my immediate family members are:
                      </p>
                      {familyMembers.map((item, index) => (
                        <div key={index}>
                          <label className="inline-flex items-center">
                            <input
                              type="checkbox"
                              name="familyAssessment"
                              value={item}
                              checked={formData.familyAssessment.includes(item)}
                              onChange={handleChange}
                              className="form-checkbox h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">
                              {item}
                            </span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Financial Status */}
            <section aria-labelledby="plan-heading">
              <div className="shadow sm:overflow-hidden sm:rounded-md">
                <div className="space-y-6 bg-white p-7 sm:p-6">
                  <div>
                    <h2
                      id="plan-heading"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Finacial Status
                    </h2>
                  </div>

                  <div className="lg:w-[720px] sm:w-full flex flex-col gap-4">
                    <div className="space-y-2">
                      <p className="mt-1 text-sm text-gray-500">
                        Please select one of the following currencies for the
                        below options.
                      </p>
                      <select
                        name="selectCurrency"
                        value={formData.selectCurrency}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                      >
                        <option value="">Select your currency</option>
                        {currency.map((item, index) => (
                          <option value={item} key={index}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <p className="mt-1 text-sm text-gray-500">
                        Your sources of income Your answer is considered as the
                        source of funds for your investments
                      </p>
                      {financialStatus.map((item, index) => (
                        <div key={index}>
                          <label className="inline-flex items-center">
                            <input
                              type="checkbox"
                              name="financialStats"
                              value={item}
                              checked={formData.financialStats.includes(item)}
                              onChange={handleChange}
                              className="form-checkbox h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">
                              {item}
                            </span>
                          </label>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <p className="mt-1 text-sm text-gray-500">
                        Your sources of income, your answer is considered as the
                        source of funds for your investments
                      </p>
                      <select
                        name="job"
                        value={formData.job}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                      >
                        <option value="">Select your occupation</option>
                        {occupation.map((item, index) => (
                          <option value={item} key={index}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <p className="mt-1 text-sm text-gray-500">
                        Employer name, address and your position
                      </p>
                      <input
                        type="text"
                        name="employerDets"
                        value={formData.employerDets}
                        onChange={handleChange}
                        placeholder="Company Name, Address, Position"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <p className="mt-1 text-sm text-gray-500">
                        Net annual income
                      </p>
                      <select
                        name="netIncome"
                        value={formData.netIncome}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                      >
                        <option value="">Select your net annual income</option>
                        {netAnnualIncome.map((item, index) => (
                          <option value={item} key={index}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <p className="mt-1 text-sm text-gray-500">
                        Liquid Net Worth.
                      </p>
                      <select
                        name="liquidNetWorth"
                        value={formData.liquidNetWorth}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                      >
                        <option value="">Select liquid net worth</option>
                        {liquidNetWorth.map((item, index) => (
                          <option value={item} key={index}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <p className="mt-1 text-sm text-gray-500">
                        Total Net Worth.
                      </p>
                      <select
                        name="totalNet"
                        value={formData.totalNetWorth}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                      >
                        <option value="">Select total net worth</option>
                        {totalNetWorth.map((item, index) => (
                          <option value={item} key={index}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <p className="mt-1 text-sm text-gray-500">
                        Total cash and liquid assets (USD). Such as savings
                        accounts, brokerage accounts etc.
                      </p>
                      <select
                        name="assets"
                        value={formData.assets}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                      >
                        <option value="">
                          Select total cash and liquid assets
                        </option>
                        {netAnnualIncome.map((item, index) => (
                          <option value={item} key={index}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Submit Button */}
            <div className="mt-8 flex justify-end space-x-3">
              <button
                type="button"
                className="inline-flex items-center px-3 py-2 text-sm font-medium leading-4 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-900"
                disabled={isSubmitting}
                onClick={() => window.history.back()}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="inline-flex items-center px-3 py-2 text-sm font-medium leading-4 bg-teal-600 hover:bg-teal-700 focus:ring-teal-500 focus:ring-offset-teal-200 text-white transition ease-in focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? <DotLoader /> : "Submit"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditKyc;
