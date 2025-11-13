import { toast } from "react-toastify";

const baseOptions = {
  style: {
    background: "rgba(15, 15, 15, 0.95)",
    color: "#f5f5f5",
    borderRadius: "14px",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    boxShadow: "0 12px 30px rgba(0, 0, 0, 0.35)",
    backdropFilter: "blur(10px)",
    fontWeight: 500,
  },
  progressStyle: {
    background: "#f5f5f5",
  },
};

export const showToast = (message, type = "info") => {
  const options = { ...baseOptions };

  switch (type) {
    case "success":
      return toast.success(message, options);
    case "error":
      return toast.error(message, options);
    case "warning":
      return toast.warning(message, options);
    case "info":
      return toast.info(message, options);
    default:
      return toast(message, options);
  }
};

export default showToast;

