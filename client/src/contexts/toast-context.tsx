import { createContext, useState, ReactNode } from "react";
import ActionInterface from "../types/interfaces/action";
import ToastInterface from "../types/interfaces/toast";
import { v4 as uuid } from "uuid";
import ToastManager from "../components/organisms/toast-manager/toast-manager";

const TOAST_TIMEOUT = 5000;

type ToastColor = "primary" | "secondary" | "success" | "danger";

interface ToastContextInterface {
  toasts: ToastInterface[];
  addToast: (
    {
      id,
      color,
      title,
      body,
      actions,
    }: {
      id?: string;
      color?: ToastColor;
      title?: string;
      body?: string;
      actions?: ActionInterface[];
    },
    duration?: number
  ) => void;
  removeToast: (id: string) => void;
  error: (title: string) => void;
  success: (title: string) => void;
}

const defaultValues: ToastContextInterface = {
  toasts: [],
  addToast: () => {},
  removeToast: () => {},
  error: () => {},
  success: () => {},
};

export const ToastContext = createContext<ToastContextInterface>(defaultValues);

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<ToastInterface[]>([]);

  const addToast = (
    {
      id = uuid(),
      color = "primary",
      title,
      body,
      actions,
    }: {
      id?: string;
      color?: ToastColor;
      title?: string;
      body?: string;
      actions?: ActionInterface[];
    },
    duration = TOAST_TIMEOUT
  ) => {
    setToasts((prevToasts) => [
      ...prevToasts,
      {
        id,
        color,
        title,
        body,
        actions,
      },
    ]);
    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  const error = (title: string) => {
    addToast({ color: "danger", title });
  };

  const success = (title: string) => {
    addToast({ color: "success", title });
  };

  return (
    <ToastContext.Provider
      value={{ toasts, addToast, removeToast, error, success }}
    >
      {children}
      <ToastManager />
    </ToastContext.Provider>
  );
};
