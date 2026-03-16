const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// POST /posts - post үүсгэх
const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorId: req.user.id,
      },
    });
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: 'Серверийн алдаа', error: err.message });
  }
};

// GET /posts - бүх post харах
const getPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: { author: { select: { id: true, email: true } } },
    });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Серверийн алдаа', error: err.message });
  }
};

// DELETE /posts/:id - ABAC
const deletePost = async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const { id: userId, role } = req.user;

    // Post олох
    const post = await prisma.post.findUnique({ where: { id: postId } });

    if (!post) {
      return res.status(404).json({ message: 'Post олдсонгүй' });
    }

    // ABAC шалгалт:
    // ADMIN → бүгдийг устгана
    // USER → зөвхөн өөрийнхийг устгана
    if (role !== 'ADMIN' && post.authorId !== userId) {
      return res.status(403).json({ 
        message: 'Зөвхөн өөрийн post-ийг устгах эрхтэй' 
      });
    }

    await prisma.post.delete({ where: { id: postId } });

    res.json({ message: 'Post устгагдлаа' });
  } catch (err) {
    res.status(500).json({ message: 'Серверийн алдаа', error: err.message });
  }
};

module.exports = { createPost, getPosts, deletePost };