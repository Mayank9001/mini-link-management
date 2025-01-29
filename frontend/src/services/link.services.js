const URL = "http://localhost:3000";

export const createLink = async (data) => {
  return await fetch(`${URL}/link/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(data),
  });
};

export const editLink = async (id, data) => {
  return await fetch(`${URL}/link/edit/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(data),
  });
};

export const getAllLinks = async () => {
  return await fetch(`${URL}/link/getalllinks`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${localStorage.getItem("token")}`,
    },
  });
};
