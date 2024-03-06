// import transactions from "../data/transactions";
import PropTable from "../../components/PropTable";

const headings = [
  "No",
  "Company",
  "Share",
  "Commission",
  "Price",
  "Quantity",
  "Net amount",
];

const data = [
    {
        id: 1,
        company: "Apple",
        share: "APPL",
        commission: "$10",
        price: "$100",
        quantity: "100",
        netAmount: "$10000",
    },
    {
        id: 2,
        company: "Google",
        share: "GOOGL",
        commission: "$10",
        price: "$100",
        quantity: "100",
        netAmount: "$10000",
    },
    {
        id: 3,
        company: "Facebook",
        share: "FB",
        commission: "$10",
        price: "$100",
        quantity: "100",
        netAmount: "$10000",
    },
    {
        id: 4,
        company: "Amazon",
        share: "AMZN",
        commission: "$10",
        price: "$100",
        quantity: "100",
        netAmount: "$10000",
    },
    {
        id: 5,
        company: "Microsoft",
        share: "MSFT",
        commission: "$10",
        price: "$100",
        quantity: "100",
        netAmount: "$10000",
    },
];

function TransactionsComponent() {
  return (
    <PropTable
      title="Transactions"
      description="A table of placeholder stock market data that does not make any sense."
      data={data}
      headings={headings}
      onExportClick={() => console.log("Export Clicked")}
      editLink="#"
    />
  );
}

export default TransactionsComponent;
