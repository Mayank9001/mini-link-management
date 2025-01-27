const URL = "http://localhost:3000";

export const createLink = async (data) => {
    return await fetch(`${URL}/link/create`, {
        method:"POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `${localStorage.getItem("token")}`
        },
        body: JSON.stringify(data),
    });
};