const Blog = require("../models/blog");
const User = require("../models/user");
const calculateReadingTime = require("../readingTime");

exports.createBlog = async (req, res) => {
  try {
    const reading_time = calculateReadingTime(req.body.body);
    const blog = new Blog({ ...req.body, reading_time, author: req.user.id });
    await blog.save();
    res.status(201).json(blog);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getPublishedBlogs = async (req, res) => {
  const {
    page = 1,
    limit = 20,
    author,
    title,
    tags,
    order_by = "createdAt",
    order = "desc",
  } = req.query;
  const filters = { state: "published" };
  if (author) filters.author = author;
  if (title) filters.title = { $regex: title, $options: "i" };
  if (tags) filters.tags = { $in: tags.split(",") };

  const blogs = await Blog.find(filters)
    .sort({ [order_by]: order === "asc" ? 1 : -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .populate("author", "first_name last_name email");

  res.json(blogs);
};

exports.getBlogByID = async (req, res) => {
  const blog = await Blog.findOne({
    _id: req.params.id,
    state: "published",
  }).populate("author", "first_name last_name email");
  if (!blog) return res.status(404).json({ message: "Blog not found" });
  blog.read_count++;
  await blog.save();
  res.json(blog);
};

exports.getUserBlogs = async (req, res) => {
  const blogs = await Blog.find({ author: req.user.id }).sort({
    createdAt: -1,
  });
  res.json(blogs);
};

exports.updateBlog = async (req, res) => {
  const blog = await Blog.findOne({ _id: req.params.id, author: req.user.id });
  if (!blog) return res.status(404).json({ message: "Blog not found" });
  Object.assign(blog, req.body);
  blog.reading_time = calculateReadingTime(blog.body);
  await blog.save();
  res.json(blog);
};

exports.updateToPublish = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    // Check ownership
    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    blog.state = "published";
    await blog.save();

    res.status(200).json({ message: "Blog published", blog });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteBlog = async (req, res) => {
  const blog = await Blog.findOneAndDelete({
    _id: req.params.id,
    author: req.user.id,
  });
  if (!blog) return res.status(404).json({ message: "Blog not found" });
  res.json({ message: "Deleted" });
};
