import express from "express";

import * as postController from "../controllers/post.controller.js";
import { authenticate, requireSelf } from "../middlewares/auth.middleware.js";
import validate, { validatePostId } from "../middlewares/validation.middleware.js";

const router = express.Router();

router.post(
  "/post/:author",
  authenticate,
  requireSelf("author"),
  validate("authorParam", "params"),
  validate("createPost"),
  postController.createPost,
);
router.get("/post/:postId", validatePostId, postController.getPostById);
router.patch(
  "/post/:postId",
  authenticate,
  validatePostId,
  validate("updatePost"),
  postController.updatePost,
);
router.delete(
  "/post/:postId",
  authenticate,
  validatePostId,
  postController.deletePost,
);
router.patch("/post/:postId/like", validatePostId, postController.addLike);
router.patch(
  "/post/:postId/comment/:commenter",
  validatePostId,
  validate("addComment"),
  postController.addComment,
);
router.get("/posts", postController.getPosts);
router.get("/posts/author/:user", postController.getPostsByAuthor);
router.get("/posts/tags", validate("tagsQuery", "query"), postController.getPostsByTags);
router.get(
  "/posts/period",
  validate("dateFormatPeriod", "query"),
  postController.getPostsByPeriod,
);

export default router;
