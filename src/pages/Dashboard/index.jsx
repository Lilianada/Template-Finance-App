import {
  React,
  useState
} from "react";
import { useNavigate } from "react-router-dom";
import account_details from "../../assets/images/account_details.png";
import bonds_icon from "../../assets/images/bond.png";
import fixedTerm_icon from "../../assets/images/deposit.png";
import ipos_icon from "../../assets/images/ipo.png";
import logout_icon from "../../assets/images/logout.png"; 
import notification_icon from "../../assets/images/notification.png";
import settings_icon from "../../assets/images/settings.png"; 
import { Link } from "react-router-dom";
import { auth } from "../../config/firebase";
import { ExclamationTriangleIcon } from "@heroicons/react/20/solid";
import CustomModal from "../../components/CustomModal";


export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();
  
  const menus = [
    {
      title: "Registered Users",
      icon: account_details,
      href: "/dashboard/registered_users",
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
      onClick : () => setOpenModal(true),
    },
  ];
  
  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 px-4">
      {menus.map((item, index) => (
        <li
        onClick={item.onClick}
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
      <CustomModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          title="Signout"
          description="Are you sure you want to sign out of your account?"
          showConfirmButton={true}
          confirmButtonText="Sign Out"
          cancelButtonText="Cancel"
          confirmButtonBgColor="bg-red-600"
          confirmButtonTextColor="text-white"
          onConfirm={() => {
            setIsLoading(true);
            auth
              .signOut()
              .then(() => {
                setIsLoading(false);
                navigate("/");
              })
              .catch((error) => {
                setIsLoading(false);
                console.error("Error signing out:", error);
              });
          }}
          onCancel={() => setOpenModal(false)}
          Icon={ExclamationTriangleIcon} 
          iconBgColor="bg-red-100"
          buttonBgColor="bg-red-600"
          iconTextColor="text-red-600"
          loading={isLoading}
        />
    </ul>
  );
}
