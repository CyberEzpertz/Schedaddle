import { getLocalStorage } from "@/lib/utils";
import { useEffect, useState } from "react";

const isServer = typeof window === "undefined";

export default function useLocalStorage<T>(name: string, initVal: T) {
  const [value, setValue] = useState<T>(() => initVal);

  useEffect(() => {
    if (!isServer) {
      setValue(getLocalStorage(name) || initVal);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const modifyValue = (newVal: T) => {
    localStorage.setItem(name, JSON.stringify(newVal));
    setValue(newVal);
  };

  const deleteValue = () => {
    localStorage.removeItem(name);
    setValue(initVal);
  };

  return [value, modifyValue, deleteValue] as const;
}
