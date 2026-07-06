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

export async function createPost(body = {}) {
  return postRepository.create({
    title: body.title || "",
    content: body.content || "",
    author: body.author || "",
    tags: normalizeTags(body.tags),
    likes: 0,
    comments: [],
  });
}

export async function getPostById(postId) {
  return postRepository.findById(postId);
}

export async function updatePost(postId, body = {}) {
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

export async function deletePost(postId) {
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
