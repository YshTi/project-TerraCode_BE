import createHttpError from "http-errors";

const MAX_IMAGE_SIZE = 1024 * 1024; // 1 MB

export const validateImageUrl = async (imageUrl, fieldName = "Image") => {
  let response;

  try {
    response = await fetch(imageUrl, { method: "HEAD" });
  } catch {
    throw createHttpError(400, `${fieldName} URL is not accessible or invalid`);
  }

  if (!response.ok) {
    throw createHttpError(400, `${fieldName} URL is not accessible or invalid`);
  }

  const contentType = response.headers.get("content-type");

  if (contentType && !contentType.startsWith("image/")) {
    throw createHttpError(400, `${fieldName} URL must point to an image`);
  }

  const contentLength = response.headers.get("content-length");

  if (!contentLength) {
    throw createHttpError(400, `Unable to verify ${fieldName.toLowerCase()} size`);
  }

  if (Number(contentLength) > MAX_IMAGE_SIZE) {
    throw createHttpError(400, `${fieldName} size must be less than 1MB`);
  }
};