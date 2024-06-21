export const addData = (ws, data) => {
  console.log("ADD-" + JSON.stringify(data));
  ws.send("ADD-" + JSON.stringify(data));
};

export const deleteData = (ws, index) => {
  ws.send("DELETE-" + index);
};

export const updateData = (ws, index, data) => {
  console.log("UPDATE-" + index + "-" + JSON.stringify(data));
  ws.send("UPDATE-" + index + "-" + JSON.stringify(data));
};
