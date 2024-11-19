import { useEffect, useState } from "react";

export default function useDebounce(emailVal: string) {
  const [userEmailVal, setUserEmailVal] = useState(emailVal);

  useEffect(() => {
    const timer = setTimeout(() => {
      setUserEmailVal(emailVal);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [emailVal]);

  return userEmailVal;
}
