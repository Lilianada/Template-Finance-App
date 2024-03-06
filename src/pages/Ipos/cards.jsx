import { Fragment, useEffect, useState } from "react";
import { Menu, Transition, Dialog } from "@headlessui/react";
import { EllipsisHorizontalIcon } from "@heroicons/react/20/solid";
import { Link } from "react-router-dom";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/20/solid";
import { getAllBonds } from "../../config/bonds";

const product = {
  name: "Zip Tote Basket",
  price: "$220",
  rating: 3.9,
  href: "#",
  description:
    "The Zip Tote Basket is the perfect midpoint between shopping tote and comfy backpack. With convertible straps, you can hand carry, should sling, or backpack this convenient and spacious bag. The zip top and durable canvas construction keeps your goods protected for all-day use.",
  imageSrc:
    "https://tailwindui.com/img/ecommerce-images/product-page-03-product-04.jpg",
  imageAlt: "Back angled view with bag open and handles to the side.",
  colors: [
    {
      name: "Washed Black",
      bgColor: "bg-gray-700",
      selectedColor: "ring-gray-700",
    },
    { name: "White", bgColor: "bg-white", selectedColor: "ring-gray-400" },
    {
      name: "Washed Gray",
      bgColor: "bg-gray-500",
      selectedColor: "ring-gray-500",
    },
  ],
};

const statuses = {
  Paid: "text-green-700 bg-green-50 ring-green-600/20",
  Withdraw: "text-gray-600 bg-gray-50 ring-gray-500/10",
  Overdue: "text-red-700 bg-red-50 ring-red-600/10",
};
const bonds = [
  {
    id: 1,
    name: "Tuple",
    imageUrl: "https://tailwindui.com/img/logos/48x48/tuple.svg",
    lastInvoice: {
      date: "December 13, 2022",
      dateTime: "2022-12-13",
      amount: "$2,000.00",
      status: "Overdue",
    },
  },
  {
    id: 2,
    name: "SavvyCal",
    imageUrl: "https://tailwindui.com/img/logos/48x48/savvycal.svg",
    lastInvoice: {
      date: "January 22, 2023",
      dateTime: "2023-01-22",
      amount: "$14,000.00",
      status: "Paid",
    },
  },
  {
    id: 3,
    name: "Reform",
    imageUrl: "https://tailwindui.com/img/logos/48x48/reform.svg",
    lastInvoice: {
      date: "January 23, 2023",
      dateTime: "2023-01-23",
      amount: "$7,600.00",
      status: "Paid",
    },
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Cards() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [bonds, setBonds] = useState([]);

  const fetchBonds = async () => {
    try {
      setIsLoading(true);
      const fetchedBonds = await getAllBonds();
      setBonds(fetchedBonds);
    } catch (error) {
      console.error("Error fetching bonds:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBonds();
  }, []);


  return (
    <>
      <ul className="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3 xl:gap-x-8">
        {bonds.map((bond) => (
          <li
            key={bond.id}
            className="overflow-hidden rounded-xl border border-gray-200"
          >
            <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6">
              <img
                src={bond.image}
                alt={bond.issuerName}
                className="h-12 w-12 flex-none rounded-lg bg-white object-cover ring-1 ring-gray-900/10"
              />
              <div className="text-sm font-medium leading-6 text-gray-900">
                {bond.issuerName}
              </div>
              <Menu as="div" className="relative ml-auto">
                <Menu.Button className="-m-2.5 block p-2.5 text-gray-400 hover:text-gray-500">
                  <span className="sr-only">Open options</span>
                  <EllipsisHorizontalIcon
                    className="h-5 w-5"
                    aria-hidden="true"
                  />
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-0.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                    <Menu.Item>
                      {({ active }) => (
                        <div
                          onClick={() => setOpen(true)}
                          className={classNames(
                            active ? "bg-gray-50" : "",
                            "block px-3 py-1 text-sm leading-6 text-gray-900"
                          )}
                        >
                          View<span className="sr-only">, {bond.name}</span>
                        </div>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="#"
                          className={classNames(
                            active ? "bg-gray-50" : "",
                            "block px-3 py-1 text-sm leading-6 text-gray-900"
                          )}
                        >
                          Edit<span className="sr-only">, {bond.name}</span>
                        </Link>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
            <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
              <div className="flex justify-between gap-x-4 py-3">
                <p className="text-gray-500 text-left">
                  The Zip Tote Basket is the perfect midpoint between shopping
                  tote and comfy backpack. With convertible straps, you can hand
                  carry, should sling, or backpack this convenient and spacious
                  bag. The zip top and durable canvas construction keeps your
                  goods protected for all-day use.
                </p>
              </div>
              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-gray-500">Last invoice</dt>
                <dd className="text-gray-700">
                  <time dateTime={bond.lastInvoice.dateTime}>
                    {bond.lastInvoice.date}
                  </time>
                </dd>
              </div>
              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-gray-500">Last invoice</dt>
                <dd className="text-gray-700">
                  <time dateTime={bond.lastInvoice.dateTime}>
                    {bond.lastInvoice.date}
                  </time>
                </dd>
              </div>
              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-gray-500">Amount</dt>
                <dd className="flex items-start gap-x-2">
                  <div className="font-medium text-gray-900">
                    {bond.lastInvoice.amount}
                  </div>
                  <div
                    className={classNames(
                      statuses[bond.lastInvoice.status],
                      "rounded-md py-1 px-2 text-xs font-medium ring-1 ring-inset"
                    )}
                  >
                    {bond.lastInvoice.status}
                  </div>
                </dd>
              </div>
              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-gray-500">Amount</dt>
                <dd className="flex items-start gap-x-2">
                  <div className="font-medium text-gray-900">
                    {bond.lastInvoice.amount}
                  </div>
                  <div
                    className={classNames(
                      statuses[bond.lastInvoice.status],
                      "rounded-md py-1 px-2 text-xs font-medium ring-1 ring-inset"
                    )}
                  >
                    {bond.lastInvoice.status}
                  </div>
                </dd>
              </div>
              <div className="col-span-1 flex rounded-md shadow-sm">
                <div className="flex flex-1 items-center justify-between rounded-md truncate  bg-black my-6">
                  <div className="flex-1 truncate px-4 py-2 text-sm">
                    <p className="text-white font-bold text-xl">20%</p>
                    <p className="font-medium text-white hover:text-white">
                      Coupon
                    </p>
                  </div>
                </div>
              </div>
            </dl>
          </li>
        ))}
      </ul>

      {/* Dialog */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 hidden bg-gray-500 bg-opacity-75 transition-opacity md:block" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-stretch justify-center text-center md:items-center md:px-2 lg:px-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
                enterTo="opacity-100 translate-y-0 md:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 md:scale-100"
                leaveTo="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
              >
                <Dialog.Panel className="flex w-full transform text-left text-base transition md:my-8 md:max-w-lg md:px-4 lg:max-w-lg">
                  <div className="relative flex w-full items-center overflow-hidden bg-white px-4 pb-8 pt-14 shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8 rounded-lg">
                    <button
                      type="button"
                      className="absolute right-4 top-4 text-gray-400 hover:text-gray-500 sm:right-6 sm:top-8 md:right-6 md:top-6 lg:right-8 lg:top-8"
                      onClick={() => setOpen(false)}
                    >
                      <span className="sr-only">Close</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>

                    <div className="grid w-full items-start gap-x-6 gap-y-8 lg:gap-x-8">
                      <div className="sm:col-span-8 lg:col-span-7">
                        <h2 className="text-2xl font-bold text-gray-900 sm:pr-12">
                          {product.name}
                        </h2>

                        <section
                          aria-labelledby="information-heading"
                          className="mt-3"
                        >
                          <h3 id="information-heading" className="sr-only">
                            Product information
                          </h3>

                          <p className="text-2xl text-gray-900">
                            {product.price}
                          </p>

                          {/* Reviews */}
                          <div className="mt-3">
                            <h4 className="sr-only">Reviews</h4>
                            <div className="flex items-center">
                              <div className="flex items-center">
                                {[0, 1, 2, 3, 4].map((rating) => (
                                  <StarIcon
                                    key={rating}
                                    className={classNames(
                                      product.rating > rating
                                        ? "text-gray-400"
                                        : "text-gray-200",
                                      "h-5 w-5 flex-shrink-0"
                                    )}
                                    aria-hidden="true"
                                  />
                                ))}
                              </div>
                              <p className="sr-only">
                                {product.rating} out of 5 stars
                              </p>
                            </div>
                          </div>

                          <div className="mt-6">
                            <h4 className="sr-only">Description</h4>

                            <p className="text-sm text-gray-700">
                              {product.description}
                            </p>
                          </div>
                        </section>

                        <section
                          aria-labelledby="options-heading"
                          className="mt-6"
                        >
                          <h3 id="options-heading" className="sr-only">
                            Product options
                          </h3>
                        </section>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
