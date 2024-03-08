import React, { useState } from "react";
import { RadioGroup } from "@headlessui/react";
import {
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
    tradingExperience,
    tradingKnowledgeAssessment,
    tradingStrategy,
} from "./data";



function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function EditKyc() {
  const [selectedPlan, setSelectedPlan] = useState(riskReward[1]);
  const [formData, setFormData] = useState({
    primaryPurpose: "",
    tradingExperience: "",
    plannedInvestments: [],
    investmentWindow: "",
    stocksExperience: "",
    stocksInvestment: "",
    cryptoExperience: "",
    cryptoInvestment: "",
    leveragedExperience: "",
    leveragedInvestment: "",
    tradingKnowledge: [],
    knowledgeAssessment: [],
    tradingStrategy: "",
    purposeOfTrading: "",
    attitudeToRisk: "",
    financialStatus: [],
    occupation: "",
    employerDetails: "",
    netAnnualIncome: "",
    liquidAssets: "",
    investmentAmount: "",
    riskReward: "",
    familyMembers: [],
    verifyAccount: "",
  });

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
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formData);
    // Implement your submission logic here, e.g., send data to an API
  };

  return (
    <div className="bg-gray-50 py-6 px-4 my-8 rounded-md shadow text-left">
      <div className="">
        <div className="px-4 sm:px-0 text-left">
          <h3 className="text-lg font-semibold leading-7 text-gray-900">
            Know Your Customer (KYC)
          </h3>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
            Edit details about 's Account.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* Form sections */}
          <div className="space-y-4 grid gap-4">
            {/* Your Goal */}
            <section aria-labelledby="plan-heading">
              <div className="shadow sm:overflow-hidden sm:rounded-md">
                <div className="space-y-6 bg-white px-4 py-6 sm:p-6">
                  <div>
                    <h2
                      id="plan-heading"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Your goal
                    </h2>
                  </div>

                  {/* Purpose of trade */}
                  <div className="mt-2 space-y-2">
                    <p className="mt-1 text-sm text-gray-500">
                      Primary purpose of trading with us
                    </p>
                    <select
                      name="primaryPurpose"
                      value={formData.primaryPurpose}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                  <div className="mt-2 space-y-2">
                    <p className="mt-1 text-sm text-gray-500">
                      Planned investments
                    </p>
                    <select
                      name="primaryPurpose"
                      value={formData.plannedInvestments}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="">Select your planned investments</option>
                      {plannedInvestments.map((investment, index) => (
                        <option value={investment} key={index}>
                          {investment}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/*Investment window */}
                  <div className="mt-2 space-y-2">
                    <p className="mt-1 text-sm text-gray-500">
                      Investment window
                    </p>
                    <select
                      name="primaryPurpose"
                      value={formData.investmentWindow}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
            </section>

            {/* Stock investing experience */}
            <section aria-labelledby="plan-heading">
              <div className="shadow sm:overflow-hidden sm:rounded-md">
                <div className="space-y-6 bg-white px-4 py-6 sm:p-6">
                  <div>
                    <h2
                      id="plan-heading"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Stocks Investing Experience
                    </h2>
                  </div>

                  <div className="mt-2 space-y-2">
                    <p className="mt-1 text-sm text-gray-500">
                      Over the last year, how many times have you invested in
                      stocks and/or ETFs?
                    </p>
                    {["1-10", "10-20", "20 plus"].map((investment, index) => (
                      <div key={index}>
                        <label className="inline-flex items-center">
                          <input
                            type="checkbox"
                            name="plannedInvestments"
                            value={investment}
                            checked={formData.plannedInvestments.includes(
                              investment
                            )}
                            onChange={handleChange}
                            className="form-checkbox h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            {investment}
                          </span>
                        </label>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 space-y-2">
                    <p className="mt-1 text-sm text-gray-500">
                      In the last year, how much have you invested in stocks
                      and/or ETFs?
                    </p>
                    {["$1-$500", "$500-$2000", "$2000+"].map(
                      (investment, index) => (
                        <div key={index}>
                          <label className="inline-flex items-center">
                            <input
                              type="checkbox"
                              name="plannedInvestments"
                              value={investment}
                              checked={formData.plannedInvestments.includes(
                                investment
                              )}
                              onChange={handleChange}
                              className="form-checkbox h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
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
            </section>

            {/* Crypto investing experience */}
            <section aria-labelledby="plan-heading">
              <div className="shadow sm:overflow-hidden sm:rounded-md">
                <div className="space-y-6 bg-white px-4 py-6 sm:p-6">
                  <div>
                    <h2
                      id="plan-heading"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Crypto Investing Experience
                    </h2>
                  </div>

                  <div className="mt-2 space-y-2">
                    <p className="mt-1 text-sm text-gray-500">
                      Over the last year, how many times have you invested in
                      crypto?
                    </p>
                    {["1-10", "10-20", "20 plus"].map((investment, index) => (
                      <div key={index}>
                        <label className="inline-flex items-center">
                          <input
                            type="checkbox"
                            name="plannedInvestments"
                            value={investment}
                            checked={formData.plannedInvestments.includes(
                              investment
                            )}
                            onChange={handleChange}
                            className="form-checkbox h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            {investment}
                          </span>
                        </label>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 space-y-2">
                    <p className="mt-1 text-sm text-gray-500">
                      How much did you invest?
                    </p>
                    {["$1-$500", "$500-$2000", "$2000 plus"].map(
                      (investment, index) => (
                        <div key={index}>
                          <label className="inline-flex items-center">
                            <input
                              type="checkbox"
                              name="plannedInvestments"
                              value={investment}
                              checked={formData.plannedInvestments.includes(
                                investment
                              )}
                              onChange={handleChange}
                              className="form-checkbox h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
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
            </section>

            {/* Leverage investing experience */}
            <section aria-labelledby="plan-heading">
              <div className="shadow sm:overflow-hidden sm:rounded-md">
                <div className="space-y-6 bg-white px-4 py-6 sm:p-6">
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

                  <div className="mt-2 space-y-2">
                    <p className="mt-1 text-sm text-gray-500">
                      How many of these types of investments have you made?
                    </p>
                    {["1-10", "10-40", "40 plus"].map((investment, index) => (
                      <div key={index}>
                        <label className="inline-flex items-center">
                          <input
                            type="checkbox"
                            name="plannedInvestments"
                            value={investment}
                            checked={formData.plannedInvestments.includes(
                              investment
                            )}
                            onChange={handleChange}
                            className="form-checkbox h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            {investment}
                          </span>
                        </label>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 space-y-2">
                    <p className="mt-1 text-sm text-gray-500">
                      In the last year, how much have you invested in crypto?
                    </p>
                    {["$1-$500", "$500-$2000", "$2000 plus"].map(
                      (investment, index) => (
                        <div key={index}>
                          <label className="inline-flex items-center">
                            <input
                              type="checkbox"
                              name="plannedInvestments"
                              value={investment}
                              checked={formData.plannedInvestments.includes(
                                investment
                              )}
                              onChange={handleChange}
                              className="form-checkbox h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
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
            </section>

            {/* Trading Knowledge and Experience */}
            <section aria-labelledby="plan-heading">
              <div className="shadow sm:overflow-hidden sm:rounded-md">
                <div className="space-y-6 bg-white px-4 py-6 sm:p-6">
                  <div>
                    <h2
                      id="plan-heading"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Your Trading Knowldge and Experience
                    </h2>
                  </div>

                  {/* Trading Experience */}
                  <div className="mt-2 space-y-2">
                    <p className="mt-1 text-sm text-gray-500">
                      Trading Experience
                    </p>
                    <select
                      name="tradingExperience"
                      value={formData.tradingExperience}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="">Select your trading experience</option>
                        {tradingExperience.map((experience, index) => (
                            <option value={experience} key={index}>
                                {experience}
                            </option>
                        ))}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
                    </select>
                  </div>

                  {/* Trading education experience */}
                  <div className="mt-2 space-y-2">
                    <p className="mt-1 text-sm text-gray-500">
                      What's your investment education experience regarding
                      leveraged products?(CDs, Futures, Options, Forex, Margin
                      trade and ETF). Please select one or more relevant
                      answers.
                    </p>
                    <select
                      name="educationExperience"
                      value={formData.educationExperience}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="">Select your education experience</option>
                      {educationExperience.map((experience, index) => (
                        <option value={experience} key={index}>
                          {experience}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/*Trading knowledge assessment  */}
                  <div className="mt-2 space-y-2">
                    <p className="mt-1 text-sm text-gray-500">
                      We would like to assess your level of knowledge of complex
                      derivatives and trading with leverage
                    </p>
                    {tradingKnowledgeAssessment.map((investment, index) => (
                      <div key={index}>
                        <label className="inline-flex items-center">
                          <input
                            type="checkbox"
                            name="plannedInvestments"
                            value={investment}
                            checked={formData.plannedInvestments.includes(
                              investment
                            )}
                            onChange={handleChange}
                            className="form-checkbox h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            {investment}
                          </span>
                        </label>
                      </div>
                    ))}
                  </div>

                  {/* Trading strategy */}
                  <div className="mt-2 space-y-2">
                    <p className="mt-1 text-sm text-gray-500">
                      How long do you plan to leave your positions open?
                    </p>
                    <select
                      name="tradingExperience"
                      value={formData.tradingStrategy}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                  <div className="mt-2 space-y-2">
                    <p className="mt-1 text-sm text-gray-500">
                      What best describes your primary purpose of trading with
                      us?
                    </p>
                    <select
                      name="tradingExperience"
                      value={formData.purposeOfTrading}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                  <div className="mt-2 space-y-2">
                    <p className="mt-1 text-sm text-gray-500">
                      How much are you willing to invest?
                    </p>
                    <select
                      name="tradingExperience"
                      value={formData.investmentAmount}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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

                  {/* Risk reward */}
                  <div className="mt-2 space-y-2">
                    <p className="mt-1 text-sm text-gray-500">
                      Which risk/reward scenario best describes your annual
                      investments expectations with us?
                    </p>
                    <RadioGroup value={selectedPlan} onChange={setSelectedPlan}>
                      <RadioGroup.Label className="sr-only">
                        Select your attitude to risk
                      </RadioGroup.Label>
                      <div className="relative -space-y-px rounded-md bg-white">
                        {riskReward.map((plan, planIdx) => (
                          <RadioGroup.Option
                            key={plan.name}
                            value={plan}
                            className={({ checked }) =>
                              classNames(
                                planIdx === 0
                                  ? "rounded-tl-md rounded-tr-md"
                                  : "",
                                planIdx === riskReward.length - 1
                                  ? "rounded-bl-md rounded-br-md"
                                  : "",
                                checked
                                  ? "z-10 border-orange-200 bg-orange-50"
                                  : "border-gray-200",
                                "relative flex cursor-pointer flex-col border p-4 focus:outline-none md:grid md:grid-cols-2 md:pr-6"
                              )
                            }
                          >
                            {({ active, checked }) => (
                              <>
                                <span className="flex items-center text-sm">
                                  <span
                                    className={classNames(
                                      checked
                                        ? "bg-orange-500 border-transparent"
                                        : "bg-white border-gray-300",
                                      active
                                        ? "ring-2 ring-offset-2 ring-gray-900"
                                        : "",
                                      "h-4 w-4 rounded-full border flex items-center justify-center"
                                    )}
                                    aria-hidden="true"
                                  >
                                    <span className="rounded-full bg-white w-1.5 h-1.5" />
                                  </span>
                                  <RadioGroup.Label
                                    as="span"
                                    className="ml-3 font-medium text-gray-900"
                                  >
                                    {plan.name}
                                  </RadioGroup.Label>
                                </span>

                                <RadioGroup.Description
                                  as="span"
                                  className={classNames(
                                    checked
                                      ? "text-orange-700"
                                      : "text-gray-500",
                                    "ml-6 pl-1 text-sm md:ml-0 md:pl-0 md:text-left"
                                  )}
                                >
                                  {plan.limit}
                                </RadioGroup.Description>
                              </>
                            )}
                          </RadioGroup.Option>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>

                  {/*Trading knowledge assessment  */}
                  <div className="mt-2 space-y-2">
                    <p className="mt-1 text-sm text-gray-500">
                      Does any of the following apply to you? <br /> I or any of
                      my immediate family members are:
                    </p>
                    {familyMembers.map((item, index) => (
                      <div key={index}>
                        <label className="inline-flex items-center">
                          <input
                            type="checkbox"
                            name="familyMembers"
                            value={item}
                            checked={formData.familyMembers.includes(item)}
                            onChange={handleChange}
                            className="form-checkbox h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
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
            </section>

            {/* Risk Reward */}
            <section aria-labelledby="plan-heading">
              <div className="shadow sm:overflow-hidden sm:rounded-md">
                <div className="space-y-6 bg-white px-4 py-6 sm:p-6">
                  <div>
                    <h2
                      id="plan-heading"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Your Finacial Status
                    </h2>
                  </div>

                  <div className="mt-2 space-y-2">
                    <p className="mt-1 text-sm text-gray-500">
                      Your sources of income Your answer is considered as the
                      source of funds for your investments
                    </p>
                    {financialStatus.map((item, index) => (
                      <div key={index}>
                        <label className="inline-flex items-center">
                          <input
                            type="checkbox"
                            name="familyMembers"
                            value={item}
                            checked={formData.financialStatus.includes(item)}
                            onChange={handleChange}
                            className="form-checkbox h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            {item}
                          </span>
                        </label>
                      </div>
                    ))}
                  </div>

                  <div className="mt-2 space-y-2">
                    <div className="mt-2 space-y-2">
                      <p className="mt-1 text-sm text-gray-500">
                        Your sources of income Your answer is considered as the
                        source of funds for your investments
                      </p>
                      <select
                        name="occupation"
                        value={formData.occupation}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      >
                        <option value="">Select your occupation</option>
                        {occupation.map((item, index) => (
                          <option value={item} key={index}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mt-2 space-y-2">
                    <p className="mt-1 text-sm text-gray-500">
                      Employer name, address and your position
                    </p>
                    <input
                      type="text"
                      name="employerDetails"
                      value={formData.employerDetails}
                      onChange={handleChange}
                      placeholder="Company Name, Address, Position"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div className="mt-2 space-y-2">
                    <p className="mt-1 text-sm text-gray-500">
                      Your net annual income (USD)
                    </p>
                    <select
                      name="netAnnualIncome"
                      value={formData.netAnnualIncome}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="">Select your net annual income</option>
                      {netAnnualIncome.map((item, index) => (
                        <option value={item} key={index}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mt-2 space-y-2">
                    <p className="mt-1 text-sm text-gray-500">
                      Your total cash and liquid assets (USD). Such as savings
                      accounts, brokerage accounts etc.
                    </p>
                    <select
                      name="netAnnualIncome"
                      value={formData.liquidAssets}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="">
                        Select your total cash and liquid assets
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
            </section>


            {/* Submit Button */}
            <button
              type="submit"
              className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg "
            >
              Submit KYC Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditKyc;
