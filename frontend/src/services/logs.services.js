const URL = "http://localhost:3000";

export const getlogs = async () => {
  return await fetch(`${URL}/logs/getlogs`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${localStorage.getItem("token")}`,
    },
  });
};
