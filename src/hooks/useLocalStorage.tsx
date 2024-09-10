import { getLocalStorage } from "@/lib/utils";
import { useEffect, useState } from "react";

const isServer = typeof window === "undefined";

export default function useLocalStorage<T>(
  name: string,
  initVal: T,
  key?: string
) {
  const [value, setValue] = useState<T>(() => initVal);
  const [snapshot, setSnapshot] = useState<Record<string, T>>({});

  useEffect(() => {
    if (!isServer) {
      if (key) {
        const newSnap = getLocalStorage(name) ?? {};
        setSnapshot(newSnap);
        setValue(newSnap[key] ?? initVal);
      } else {
        setValue(getLocalStorage(name) || initVal);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const modifyValue = (newVal: T) => {
    if (!key) {
      localStorage.setItem(name, JSON.stringify(newVal));
      setValue(newVal);
    } else {
      const combined = { ...snapshot, [key]: newVal };
      localStorage.setItem(name, JSON.stringify(combined));
      setSnapshot(combined);
      setValue(newVal);
    }
  };

  const deleteValue = () => {
    if (!key) {
      localStorage.removeItem(name);
    } else {
      // Assert that the value is an object since it has a key.
      const newVal = delete { ...(value as Record<any, any>) }[key];
      localStorage.setItem(name, JSON.stringify(newVal));
    }

    setValue(initVal);
  };

  return [value, modifyValue, deleteValue] as const;
}
