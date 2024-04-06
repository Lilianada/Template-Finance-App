
export const customAlert = ({
    showAlert,
    title,
    text,
    icon,
    iconBgColor,
    iconTextColor,
    cancelButtonBgColor,
    showConfirmButton,
    timer,
}) => {
    showAlert({
      title: title,
      description: text,
      Icon: icon || null, 
      iconBgColor: iconBgColor ,
      iconTextColor: iconTextColor,
      showConfirmButton,
      cancelButtonBgColor: cancelButtonBgColor ,
      timer: timer || 0,
    });
};
