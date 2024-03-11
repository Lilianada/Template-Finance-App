import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
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
import { getUserKyc } from "../../../config/user";
import DotLoader from "../../../components/DotLoader";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function EditKyc() {
  const location = useLocation();
  const { editKyc } = location.state || {};
  const uid = editKyc;
  
  const [formData, setFormData] = useState({
    primaryPurpose: primaryPurpose || '',
    tradingExperience: tradingExperience || '',
    plannedInvestments: plannedInvestments || [],
    investmentWindow:  investmentWindow || '',
    // tradingKnowledge: tradingKnowledge || '',
    tradingStrategy: tradingStrategy || '',
    purposeOfTrading: purposeOfTrading || '',
    financialStatus: financialStatus || '',
    occupation: occupation || '',
    // employerDetails: employerDetails || '',
    netAnnualIncome: netAnnualIncome || '',
    // liquidAssets: liquidAssets  || '',
    investmentAmount: investmentAmount || '',
    riskReward: riskReward || '',
    familyMembers: familyMembers || [],
  });
  const [isLoading, setIsLoading] = useState(false);
  

  useEffect(() => {
    const fetchKycDetails = async () => {
      setIsLoading(true);
      // setError('');
      try {
        const details = await getUserKyc(uid);
        setFormData(prevDetails => ({
          ...prevDetails,
          primaryPurpose: details.primaryPurpose || '',
          tradingExperience: details.tradingExperience || '',
          plannedInvestments: details.plannedInvestments || [],
          investmentWindow: details.investmentWindow || '',
          // Set other fields similarly
        }));
      } catch (err) {
        console.error('Error fetching KYC details:', err);
        // setError('Failed to fetch KYC details');
      } finally {
        setIsLoading(false);
      }
    };
    if (uid) {
      fetchKycDetails();
    }
  }, [uid]);

  // Handle field changes for both single and multiple value fields
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    if (type === 'checkbox') {
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

  if (isLoading) {
    return <DotLoader />;
  }

  return (
    <div className="bg-gray-50 py-6 px-4 my-8 rounded-md shadow text-left">
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
                      value={formData.primaryPurpose || "Select your primary purpose"}
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
                      value={formData.plannedInvestments || "Select your planned investments"}
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
                      value={formData.investmentWindow || "Select your investment window"} 
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
                            ) || false}
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
                              ) || false}
                              onChange={handleChange}
                              className="form-checkbox h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">
                              {investment || "N/A"}
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
                              ) || false}
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
                    <RadioGroup value={formData.riskReward} onChange={(value) => setFormData({...formData, riskReward: value})}>
        <div className="space-y-4">
          {riskReward.map((option, index) => (
            <RadioGroup.Option key={index} value={option}>
              {({ checked }) => (
                <div className={classNames(
                  checked ? 'bg-indigo-50 border-indigo-200 z-10' : 'border-gray-200',
                  'relative border p-4 flex cursor-pointer focus:outline-none'
                )}>
                  <span className={classNames(
                    checked ? 'bg-indigo-600 border-transparent' : 'bg-white border-gray-300',
                    'h-4 w-4 mt-0.5 cursor-pointer rounded-full border flex items-center justify-center'
                  )}
                  aria-hidden="true">
                    <span className="rounded-full bg-white w-1.5 h-1.5" />
                  </span>
                  <div className="ml-3 flex flex-col">
                    <RadioGroup.Label as="span" className="block text-sm font-medium text-gray-900">
                      {option.name}
                    </RadioGroup.Label>
                    <RadioGroup.Description as="span" className="text-sm text-gray-500">
                      {option.description}
                    </RadioGroup.Description>
                  </div>
                </div>
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
