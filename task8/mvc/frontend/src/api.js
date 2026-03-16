const BASE_URL = "http://localhost:3000";

export const getStudents = async () => {
  const res = await fetch(`${BASE_URL}/students`);
  return res.json();
};

export const createStudent = async (data) => {
  const res = await fetch(`${BASE_URL}/students`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteStudent = async (id) => {
  await fetch(`${BASE_URL}/students/${id}`, {
    method: "DELETE",
  });
};