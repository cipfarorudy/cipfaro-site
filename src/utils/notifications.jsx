// Système de notifications toast pour les interfaces utilisateurs
import { useState } from "react";

let notificationId = 0;

const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message, type = "info", duration = 5000) => {
    const id = ++notificationId;
    const notification = { id, message, type, duration };

    setNotifications((prev) => [...prev, notification]);

    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }

    return id;
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return {
    notifications,
    addNotification,
    removeNotification,
    success: (message, duration) =>
      addNotification(message, "success", duration),
    error: (message, duration) => addNotification(message, "error", duration),
    warning: (message, duration) =>
      addNotification(message, "warning", duration),
    info: (message, duration) => addNotification(message, "info", duration),
  };
};

const NotificationContainer = ({ notifications, onRemove }) => {
  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notification) => (
        <NotificationToast
          key={notification.id}
          notification={notification}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
};

const NotificationToast = ({ notification, onRemove }) => {
  const { id, message, type } = notification;

  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return "bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-emerald-200";
      case "error":
        return "bg-gradient-to-r from-red-500 to-pink-600 text-white border-red-200";
      case "warning":
        return "bg-gradient-to-r from-amber-500 to-orange-600 text-white border-amber-200";
      case "info":
      default:
        return "bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-blue-200";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return "✅";
      case "error":
        return "❌";
      case "warning":
        return "⚠️";
      case "info":
      default:
        return "ℹ️";
    }
  };

  return (
    <div
      className={`
        ${getTypeStyles()} 
        backdrop-blur-lg border rounded-xl p-4 shadow-lg 
        transform transition-all duration-300 ease-in-out
        animate-slide-in-right
      `}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{getIcon()}</span>
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button
          onClick={() => onRemove(id)}
          className="ml-4 text-white/80 hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export { useNotifications, NotificationContainer };
