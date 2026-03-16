export const getUserById = (req, res) => {
  const id = parseInt(req.params.id);

  // fake database
  const users = [
    { id: 1, name: "Batsuuri" },
    { id: 2, name: "Bat" }
  ];

  const user = users.find(u => u.id === id);

  if (!user)
    return res.status(404).json({ error: "User олдсонгүй" });

  res.json({ user });
};