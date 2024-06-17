import { useEffect, useMemo, useState } from "react";
import * as Notifications from "expo-notifications";

export const useRBP = (address, port, id, dispatcher) => {
  const [data, setData] = useState(false);
  const ws = useMemo(
    () => new WebSocket(`ws://${address}:${port}`),
    [address, port]
  );

  useEffect(() => {
    ws.onmessage = (event) => {
      try {
        message = event.data.split("-");

        switch (message[0]) {
          case "MESSAGE":
            console.log(message[1]);
            break;
          case "DATA":
            console.log("ITEMS", id, JSON.parse(message[1]));

            const items = JSON.parse(message[1]);

            dispatcher({
              type: "SET_ITEMS",
              bagId: id,
              items,
            });
            break;
          case "AVAILABLE":
            console.log("AVAILABLE", id, JSON.parse(message[1]));

            setData(JSON.parse(message[1]));

            if (JSON.parse(message[1])) {
              (async () =>
                await Notifications.scheduleNotificationAsync({
                  content: {
                    title: "Add item to bag",
                    body: "You can now add items to your bag",
                    data: {},
                  },
                  trigger: { seconds: 5 },
                }))();
            }

            break;
          default:
            break;
        }
      } catch (e) {
        console.log(e);
      }
    };

    ws.onerror = (error) => {
      console.log("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket closed");
    };

    return () => {
      ws.close();
    };
  }, []);

  return [data, ws];
};
