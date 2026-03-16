module.exports = (err, req, res, next) => {
  // err may be thrown with err.status
  const status = err.status && Number.isInteger(err.status) ? err.status : 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ success: false, message });
};