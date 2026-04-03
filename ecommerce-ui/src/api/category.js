import APIBase from "./ApiBase";

// Category services

const CATEGORY_BAR_CACHE_KEY = "llmshop.categoryBar.v1";
const CATEGORY_BAR_CACHE_TTL_MS = 10 * 60 * 1000;
let memoryCategoryBarCache = null;

const isCacheFresh = (cache) => {
  if (!cache || !cache.updatedAt || !Array.isArray(cache.data)) return false;
  return Date.now() - cache.updatedAt < CATEGORY_BAR_CACHE_TTL_MS;
};

const readCategoryBarCache = () => {
  if (memoryCategoryBarCache && isCacheFresh(memoryCategoryBarCache)) {
    return memoryCategoryBarCache.data;
  }

  if (typeof window === "undefined") return null;

  try {
    const raw = window.sessionStorage.getItem(CATEGORY_BAR_CACHE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!isCacheFresh(parsed)) return null;

    memoryCategoryBarCache = parsed;
    return parsed.data;
  } catch (error) {
    return null;
  }
};

const writeCategoryBarCache = (data) => {
  const safeData = Array.isArray(data) ? data : [];
  const payload = {
    updatedAt: Date.now(),
    data: safeData,
  };

  memoryCategoryBarCache = payload;

  if (typeof window === "undefined") return;

  try {
    window.sessionStorage.setItem(
      CATEGORY_BAR_CACHE_KEY,
      JSON.stringify(payload),
    );
  } catch (error) {
    // Ignore storage failures (private mode, quota exceeded, etc.)
  }
};

export const fetchCategories = async () => {
  const response = await APIBase.get("/api/v1/category");
  return response.data;
};

export const fetchRootCategoryChildrenSummary = async (rootId = 1) => {
  const response = await APIBase.get(
    `/api/v1/category/${rootId}/children-summary`,
  );
  return Array.isArray(response?.data) ? response.data : [];
};

export const fetchCategoryDescendantIds = async (categoryId) => {
  const response = await APIBase.get(
    `/api/v1/category/${categoryId}/descendant-ids`,
  );
  return Array.isArray(response?.data) ? response.data : [];
};

export const getCachedCategoryBarData = () => {
  return readCategoryBarCache();
};

export const setCachedCategoryBarData = (data) => {
  writeCategoryBarCache(data);
};

export const fetchCategoryDetail = async (id) => {
  const response = await APIBase.get(`/api/v1/category/${id}`);
  return response.data;
};

export const createCategory = async (category) => {
  const response = await APIBase.post("/api/v1/category", category);
  return response.data;
};

export const updateCategory = async (id, category) => {
  const response = await APIBase.put(`/api/v1/category/${id}`, category);
  return response.data;
};

export const deleteCategory = async (id) => {
  await APIBase.delete(`/api/v1/category/${id}`);
};
