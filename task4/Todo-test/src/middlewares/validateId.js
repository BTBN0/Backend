module.exports = function validateId(req, res, next) {
  const { id } = req.params;
  // ID нь тоо байх ёстой
  if (!/^\d+$/.test(id)) {
    return res.status(400).json({ success: false, message: 'id тоо байх ёстой' });
  }
  next();
};