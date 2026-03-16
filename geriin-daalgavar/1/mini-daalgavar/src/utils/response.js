export const success = (res, data) => res.json({ success: true, data });
export const fail = (res, message) => res.status(400).json({ success: false, message });