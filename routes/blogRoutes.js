const express = require("express");
const auth = require("../middleswares/auth");
const passport = require("passport");
const router = express.Router();

const {
  createBlog,
  getPublishedBlogs,
  getBlogByID,
  getUserBlogs,
  updateBlog,
  updateToPublish,
  deleteBlog,
} = require("../controllers/blogControllers");

router.get("/", getPublishedBlogs);
router.get("/myblogs", auth, getUserBlogs);
router.get("/:id", getBlogByID);


router.post("/", auth, createBlog);
router.put("/:id", auth, updateBlog);
router.patch("/:id/publish", auth, updateToPublish);
router.delete("/:id", auth, deleteBlog);

module.exports = router;
