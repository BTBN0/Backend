export const login = (req, res) => {
  const { email } = req.body;

  return res.json({
    message: "Амжилттай нэвтэрлээ",
    user: { email }
  });
};