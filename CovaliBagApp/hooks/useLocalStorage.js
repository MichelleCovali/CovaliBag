import { useState, useEffect, useMemo, useReducer } from "react";
import Storage from "react-native-storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useLocalStorage = (key, initialValue) => {
  const [data, setData] = useState(initialValue);

  const storage = useMemo(
    () =>
      new Storage({
        size: 1000,
        storageBackend: AsyncStorage,
        defaultExpires: null,
        enableCache: true,
        sync: {},
      }),
    []
  );

  useEffect(() => {
    (async () => {
      try {
        const value = await storage.load({ key });
        setData(value || initialValue);
      } catch (error) {
        await storage.save({ key, data: initialValue });
        console.error("useAsyncStorage getItem error:", error);
      }
    })();
  }, [key, initialValue]);

  const setNewData = async (value) => {
    try {
      await storage.save({ key, data: value });
      setData(value);
    } catch (error) {
      console.error("useAsyncStorage setItem error:", error);
    }
  };

  return [data, setNewData];
};

export const useLocalStorageReducer = (key, reducer, initialValue) => {
  const [state, dispatch] = useReducer(reducer, initialValue);

  useEffect(() => {
    const loadState = async () => {
      try {
        const storedState = await AsyncStorage.getItem(key);
        if (storedState !== null) {
          dispatch({ type: "SET", payload: JSON.parse(storedState) });
        }
      } catch (error) {
        console.error("Failed to load state from AsyncStorage", error);
      }
    };
    loadState();
  }, [key]);

  useEffect(() => {
    const saveState = async () => {
      try {
        await AsyncStorage.setItem(key, JSON.stringify(state));
      } catch (error) {
        console.error("Failed to save state to AsyncStorage", error);
      }
    };
    saveState();
  }, [state, key]);
  return [state, dispatch];
};
