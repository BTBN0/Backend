import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../prisma/client.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: "Бүх талбарыг бөглөнө үү" });

    if (await prisma.user.findUnique({ where: { email } }))
      return res.status(400).json({ error: "Имэйл аль хэдийн бүртгэгдсэн" });

    const user = await prisma.user.create({
      data: { name, email, password: await bcrypt.hash(password, 10) },
      select: { id: true, name: true, email: true, role: true },
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.status(201).json({ success: true, user, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Бүх талбарыг бөглөнө үү" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ error: "Имэйл эсвэл нууц үг буруу байна" });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    const { password: _, ...safe } = user;
    res.json({ success: true, user: safe, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
