import * as postRepository from "../repository/post.repository.js";

function normalizeTags(tags) {
  if (!Array.isArray(tags)) {
    return [];
  }

  return [...new Set(tags.map((tag) => String(tag).trim()).filter(Boolean))];
}

function readValues(query, key) {
  const rawValue = query[key];
  const values = Array.isArray(rawValue) ? rawValue : [rawValue].filter(Boolean);

  return values
    .flatMap((value) => value.split(","))
    .map((value) => value.trim())
    .filter(Boolean);
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function createHttpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function hasRole(user, role) {
  return user?.roles?.includes(role);
}

function canModifyPost(user, post) {
  return (
    post?.author === user?.login ||
    hasRole(user, "ADMIN") ||
    hasRole(user, "MODERATOR")
  );
}

async function assertCanModifyPost(postId, authUser) {
  const post = await postRepository.findById(postId);

  if (!post) {
    throw createHttpError(404, `Post with id = ${postId} not found`);
  }

  if (!canModifyPost(authUser, post)) {
    throw createHttpError(403, "Post owner, moderator or admin role is required.");
  }
}

export async function createPost(author, body = {}) {
  return postRepository.create({
    title: body.title || "",
    content: body.content || "",
    author,
    tags: normalizeTags(body.tags),
    likes: 0,
    comments: [],
  });
}

export async function getPostById(postId) {
  return postRepository.findById(postId);
}

export async function getPosts() {
  return postRepository.findAll();
}

export async function updatePost(postId, authUser, body = {}) {
  await assertCanModifyPost(postId, authUser);

  const update = {};

  if (body.title !== undefined) {
    update.title = String(body.title);
  }

  if (body.content !== undefined) {
    update.content = String(body.content);
  }

  if (body.tags !== undefined) {
    update.$addToSet = {
      tags: {
        $each: normalizeTags(body.tags),
      },
    };
  }

  return postRepository.updateById(postId, update);
}

export async function deletePost(postId, authUser) {
  await assertCanModifyPost(postId, authUser);

  return postRepository.deleteById(postId);
}

export async function addLike(postId) {
  return postRepository.updateById(
    postId,
    { $inc: { likes: 1 } },
  );
}

export async function addComment(postId, commenter, body = {}) {
  return postRepository.updateById(
    postId,
    {
      $push: {
        comments: {
          user: commenter,
          message: body.message || "",
          likes: 0,
        },
      },
    },
  );
}

export async function getPostsByAuthor(author) {
  return postRepository.findByAuthor({
    $regex: `^${escapeRegex(author)}$`,
    $options: "i",
  });
}

export async function getPostsByTags(query = {}) {
  const values = readValues(query, "values");

  if (values.length === 0) {
    return [];
  }

  return postRepository.findByTags(
    values.map((value) => new RegExp(`^${escapeRegex(value)}$`, "i")),
  );
}

export async function getPostsByPeriod(dateFrom, dateTo) {
  return postRepository.findByPeriod(new Date(dateFrom), new Date(dateTo));
}
