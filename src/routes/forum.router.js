import express from "express";

import * as postController from "../controllers/post.controller.js";

const router = express.Router();

router.post("/post/:user", postController.createPost);
router.get("/post/:postId", postController.getPostById);
router.patch("/post/:postId", postController.updatePost);
router.delete("/post/:postId", postController.deletePost);
router.patch("/post/:postId/like", postController.addLike);
router.patch("/post/:postId/comment/:commenter", postController.addComment);
router.get("/posts/author/:user", postController.getPostsByAuthor);
router.get("/posts/tags", postController.getPostsByTags);
router.get("/posts/period", postController.getPostsByPeriod);

export default router;
