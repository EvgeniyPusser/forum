import * as postService from "../services/post.service.js";

export async function createPost(request, response) {
  const post = await postService.createPost(request.params.user, request.body);

  response.status(201).json(post);
}

export async function getPostById(request, response) {
  const post = await postService.getPostById(request.params.postId);

  if (!post) {
    response.sendStatus(404);
    return;
  }

  response.status(200).json(post);
}

export async function updatePost(request, response) {
  const post = await postService.updatePost(request.params.postId, request.body);

  if (!post) {
    response.sendStatus(404);
    return;
  }

  response.status(200).json(post);
}

export async function deletePost(request, response) {
  const post = await postService.deletePost(request.params.postId);

  if (!post) {
    response.status(404).json({
      message: `Post with id = ${request.params.postId} not found`,
    });
    return;
  }

  response.status(200).json(post);
}

export async function addLike(request, response) {
  const post = await postService.addLike(request.params.postId);

  if (!post) {
    response.sendStatus(404);
    return;
  }

  response.sendStatus(204);
}

export async function addComment(request, response) {
  const post = await postService.addComment(
    request.params.postId,
    request.params.commenter,
    request.body,
  );

  if (!post) {
    response.sendStatus(404);
    return;
  }

  response.status(200).json(post);
}

export async function getPostsByAuthor(request, response) {
  const posts = await postService.getPostsByAuthor(request.params.user);
  response.status(200).json(posts);
}

export async function getPostsByTags(request, response) {
  const posts = await postService.getPostsByTags(request.query);
  response.status(200).json(posts);
}

export async function getPostsByPeriod(request, response) {
  const { dateFrom, dateTo } = request.query;

  if (!dateFrom || !dateTo) {
    response.status(400).json({
      message: "Query parameters 'dateFrom' and 'dateTo' are required.",
    });
    return;
  }

  const posts = await postService.getPostsByPeriod(dateFrom, dateTo);
  response.status(200).json(posts);
}
