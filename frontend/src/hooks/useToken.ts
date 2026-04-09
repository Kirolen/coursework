import { useMemo, useState } from "react";
import { storage } from "../utils/storage";

export function useToken() {
  const [token, setTokenState] = useState<string | null>(storage.getToken());

  const setToken = (value: string | null) => {
    if (value) {
      storage.setToken(value);
    } else {
      storage.removeToken();
    }

    setTokenState(value);
  };

  const clearToken = () => {
    storage.removeToken();
    setTokenState(null);
  };

  return useMemo(
    () => ({
      token,
      setToken,
      clearToken,
    }),
    [token]
  );
}