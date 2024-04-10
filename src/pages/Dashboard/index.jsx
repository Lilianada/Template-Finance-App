import {
  React,
  useState
} from "react";
import { useNavigate } from "react-router-dom";
import account_details from "../../assets/images/account_details.png";
import transactions_icon from "../../assets/images/transaction.png";
import bonds_icon from "../../assets/images/bond.png";
import fixedTerm_icon from "../../assets/images/deposit.png";
import ipos_icon from "../../assets/images/ipo.png";
import logout_icon from "../../assets/images/logout.png"; 
import notification_icon from "../../assets/images/notification.png";
import settings_icon from "../../assets/images/settings.png"; 
import { Link } from "react-router-dom";
import { useModal } from "../../context/ModalContext";
import { auth, db } from "../../config/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { addLogNotification } from "../../config/admin";

const menus = [
  {
    title: "Registered Users",
    icon: account_details,
    href: "/dashboard/registered_users",
  },
  {
    title: "Cash Deposits",
    icon: transactions_icon,
    href: "/dashboard/cash_deposits",
  },
  {
    title: "Bonds",
    icon: bonds_icon,
    href: "/dashboard/bonds",
  },
  {
    title: "Fixed Terms",
    icon: fixedTerm_icon,
    href: "/dashboard/fixed_term_deposits",
  },
  {
    title: "IPOs",
    icon: ipos_icon,
    href: "/dashboard/ipos",
  },
  {
    title: "Notification",
    icon: notification_icon,
    href: "/dashboard/notifications",
  },
  {
    title: "Settings",
    icon: settings_icon,
    href: "/dashboard/settings",
  },
  {
    title: "Logout",
    icon: logout_icon,
    href: {},
  },
];

export default function Dashboard() {
  const {showModal, hideModal} = useModal();
  const [isLoading, setIsLoading] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setIsLoading(true);

    try {
      const user = auth.currentUser;

      if (user) {
        // Fetch the user's details from Firestore
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          await updateDoc(userRef, { isLoggedIn: false });
          await addLogNotification(userRef, user);
        }
        await auth.signOut();
      }

      setIsLoading(false);
      navigate("/");
    } catch (error) {
      setIsLoading(false);
      console.error("Error signing out:", error);
    }
  };
  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 px-4">
      {menus.map((item, index) => (
        <li
          key={index}
          className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow hover:scale-95 transition-all ease-in-out"
        >
          <Link
            to={item.href}
            className="flex w-full h-[180px] items-center justify-between space-x-6 p-6"
          >
            <div className="flex-1 truncate">
              <div className="flex items-center justify-center space-x-3">
              <img src={item.icon} className="w-12" alt="card icon" />
              </div>
              <h2 className="mt-6 truncate text-xl text-gray-500">
                {item.title}
              </h2>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
