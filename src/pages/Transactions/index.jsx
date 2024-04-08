// import transactions from "../data/transactions";
import { useEffect, useState } from "react";
import PropTable from "../../components/PropTable";
import { getAllTransactions } from "../../config/transactions";
import { doc, runTransaction, updateDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import { customModal } from "../../utils/modalUtils";
import { useModal } from "../../context/ModalContext";
import { ExclamationCircleIcon, CheckIcon } from "@heroicons/react/24/outline";

const headings = [
  "No",
  "Full Name",
  "Account",
  "Amount",
  "Type",
  "Status",
  "Date",
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
  const { showModal } = useModal();
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isApproving, setIsApproving] = useState(false);
  const [isDeclining, setIsDeclining] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditPageOpen, setIsEditPageOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [transactionForEdit, setTransactionForEdit] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true);
        const allTransactions = await getAllTransactions();
        if (!allTransactions) {
          setIsLoading(false);
          return;
        }

      
        setTransactions(allTransactions);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const showApprovalModal = (id) => {
    const selected = transactions.find((transaction) => transaction.id === id);
    setSelectedTransaction(selected);
    setIsApproving(true);
  };

  const showDeclineModal = (id) => {
    const selected = transactions.find((transaction) => transaction.id === id);
    setSelectedTransaction(selected);
    setIsDeclining(true);
  };

  const handleApproval = async () => {
    setIsLoading(true);
    try {
      // Initialize Firestore references
      const userId = selectedTransaction.userId;
      const transactionId = selectedTransaction.id;
      const accountType = selectedTransaction.accountType; // Assuming this field exists
      const amount = parseFloat(selectedTransaction.amount);
      const transactionType = selectedTransaction.type; // Assuming this is either "Deposit" or "Withdrawal"

      // Transaction Firestore Reference
      const transactionRef = doc(
        db,
        "users",
        userId,
        "transactions",
        transactionId
      );

      // Account Type Firestore Reference
      const accountTypeRef = doc(
        db,
        "users",
        userId,
        "accountTypes",
        accountType
      );

      // Start a Firestore transaction
      await runTransaction(db, async (transaction) => {
        // 1. Fetch the existing balance and type
        const accountTypeDoc = await transaction.get(accountTypeRef);
        let currentAmount = 0;
        let label = ""; // Initialize label variable

        if (accountTypeDoc.exists()) {
          currentAmount = parseFloat(accountTypeDoc.data().amount || 0);
          label = accountTypeDoc.data().label; // Fetch existing label
        }

        // 2. Update the balance based on the transaction type
        let newAmount = currentAmount;

        if (transactionType === "Deposit") {
          newAmount = currentAmount + amount;
        } else if (transactionType === "Withdrawal") {
          newAmount = currentAmount - amount;
        }

        // Check if the new amount is negative (in case of withdrawal)
        if (newAmount < 0) {
          throw new Error("Insufficient funds for withdrawal");
        }

        // 3. Update the label and amount in Firestore
        transaction.set(accountTypeRef, {
          label,
          amount: newAmount.toFixed(2),
        });

        // 4. Mark the transaction as "Approved"
        transaction.update(transactionRef, { status: "Approved" });

        // 5. Here you can also update the "Total Account Value" if needed
      });

      // Update the local state
      const transactionsCopy = [...transactions];
      const transactionIndex = transactionsCopy.findIndex(
        (transaction) => transaction.id === transactionId
      );
      transactionsCopy[transactionIndex].status = "Approved";
      setTransactions(transactionsCopy);
      customModal({
        showModal,
        title: "Success",
        message: "Transaction has been approved successfully.",
        showConfirmButton: false,
        iconBgColor: "bg-green-100",
        iconTextColor: "text-green-600",
        buttonBgColor: "bg-green-600",
        icon: CheckIcon,
        timer: 1500,
      });
    } catch (error) {
      console.error("Error updating transaction:", error);
      customModal({
        showModal,
        title: "Error",
        text: "An error occurred while updating your data. Please try again later.",
        showConfirmButton: false,
        iconTextColor: "text-red-600",
        iconBgColor: "bg-red-500",
        iconColor: "text-white",
        icon: ExclamationCircleIcon,
        timer: 1500,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRejection = async () => {
    setIsLoading(true);
    try {
      // Update the local state and local storage
      const transactionsCopy = [...transactions];
      const transactionIndex = transactionsCopy.findIndex(
        (transaction) => transaction.id === selectedTransaction.id
      );

      transactionsCopy[transactionIndex].status = "Rejected";

      const transactionRef = doc(
        db,
        "users",
        selectedTransaction.userId,
        "transactions",
        selectedTransaction.id
      );

      await updateDoc(transactionRef, {
        status: "Rejected",
      });

      // Update state
      setTransactions(transactionsCopy);
      setIsDeclining(false);

      customModal({
        showModal,
        title: "Success",
        message: "Transaction has been declined successfully.",
        showConfirmButton: false,
        iconBgColor: "bg-green-100",
        iconTextColor: "text-green-600",
        buttonBgColor: "bg-green-600",
        icon: CheckIcon,
        timer: 1500,
      });
    } catch (error) {
      console.error("Error updating transaction:", error);
     customModal({
        showModal,
        title: "Error",
        text: "An error occurred while updating your data. Please try again later.",
        showConfirmButton: false,
        iconTextColor: "text-red-600",
        iconBgColor: "bg-red-500",
        iconColor: "text-white",
        icon: ExclamationCircleIcon,
        timer: 1500,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PropTable
      title="Transactions"
      description="A table of all the deposits and withdrwals ."
      noData="No transactions found."
      data={transactions}
      headings={headings}
      onAddTransaction={() => console.log("Add Clicked")}
      editLink="#"
    />
  );
}

export default TransactionsComponent;
