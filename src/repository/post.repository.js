import { PostModel } from "../models/post.model.js";

function mapDocument(document) {
  if (!document) {
    return null;
  }

  return typeof document.toJSON === "function" ? document.toJSON() : document;
}

export async function create(postData) {
  const post = await PostModel.create(postData);
  return mapDocument(post);
}

export async function findById(postId) {
  const post = await PostModel.findById(postId);
  return mapDocument(post);
}

export async function updateById(postId, update, options = {}) {
  const post = await PostModel.findByIdAndUpdate(postId, update, {
    new: true,
    runValidators: true,
    ...options,
  });

  return mapDocument(post);
}

export async function deleteById(postId) {
  const post = await PostModel.findByIdAndDelete(postId);
  return mapDocument(post);
}

export async function findByAuthor(authorPattern) {
  const posts = await PostModel.find({
    author: authorPattern,
  });

  return posts.map(mapDocument);
}

export async function findByTags(tagPatterns) {
  const posts = await PostModel.find({
    tags: {
      $in: tagPatterns,
    },
  });

  return posts.map(mapDocument);
}

export async function findByPeriod(dateFrom, dateTo) {
  const posts = await PostModel.find({
    dateCreated: {
      $gte: dateFrom,
      $lte: dateTo,
    },
  });

  return posts.map(mapDocument);
}
