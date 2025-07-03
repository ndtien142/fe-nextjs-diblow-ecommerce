"use client";

import { useState, useEffect, useRef } from "react";
import { ApiCategory, SidebarCategory } from "@/types/categories.interface";
import { transformCategoriesToSidebar } from "@/utils/categoryUtils";
import {
  API_ENDPOINTS,
  buildApiUrl,
  createFetchConfig,
} from "@/constant/api.constant";

interface UseCategoriesReturn {
  categories: SidebarCategory[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

interface CachedCategoriesData {
  categories: SidebarCategory[];
  timestamp: number;
}

// Global cache for categories (since they rarely change)
let categoriesCache: CachedCategoriesData | null = null;
const CACHE_TIMEOUT = 30 * 60 * 1000; // 30 minutes default cache timeout

// Cache management utilities
export const clearCategoriesCache = () => {
  categoriesCache = null;
  console.log("Categories cache cleared");
};

export const isCategoriesCacheValid = () => {
  return (
    categoriesCache && Date.now() - categoriesCache.timestamp < CACHE_TIMEOUT
  );
};

export const useCategories = (
  cacheTimeout: number = CACHE_TIMEOUT
): UseCategoriesReturn => {
  const [categories, setCategories] = useState<SidebarCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Track if there's an ongoing request to prevent duplicate API calls
  const isRequestOngoingRef = useRef(false);

  const fetchCategories = async (forceRefresh = false) => {
    // Check cache first (unless force refresh)
    if (
      !forceRefresh &&
      categoriesCache &&
      Date.now() - categoriesCache.timestamp < cacheTimeout
    ) {
      console.log("Using cached categories data");
      setCategories(categoriesCache.categories);
      setLoading(false);
      setError(null);
      return;
    }

    // Prevent duplicate requests
    if (isRequestOngoingRef.current) {
      return;
    }

    try {
      isRequestOngoingRef.current = true;
      setLoading(true);
      setError(null);

      // Build the categories API URL
      const url = buildApiUrl(API_ENDPOINTS.CATEGORIES, {
        per_page: 50,
      });
      const fetchConfig = createFetchConfig();

      const response = await fetch(url, fetchConfig);

      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.statusText}`);
      }

      const apiCategories: ApiCategory[] = await response.json();
      const transformedCategories = transformCategoriesToSidebar(apiCategories);

      // Add "All Categories" option at the beginning
      const allCategoriesOption: SidebarCategory = {
        id: "all",
        name: "All Categories",
        slug: "all",
      };

      const finalCategories = [allCategoriesOption, ...transformedCategories];

      // Cache the categories data
      categoriesCache = {
        categories: finalCategories,
        timestamp: Date.now(),
      };

      setCategories(finalCategories);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch categories"
      );
      console.error("Error fetching categories:", err);

      // Fallback to default categories if API fails
      const fallbackCategories = [
        { id: "all", name: "All Categories", slug: "all" },
        {
          id: "loading-error",
          name: "Unable to load categories",
          slug: "error",
        },
      ];

      setCategories(fallbackCategories);
    } finally {
      setLoading(false);
      isRequestOngoingRef.current = false;
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    refetch: () => fetchCategories(true), // Force refresh on manual refetch
  };
};

// Hook for using categories with mock data (for development/testing)
export const useCategoriesWithMockData = (
  mockData: ApiCategory[]
): UseCategoriesReturn => {
  const [categories, setCategories] = useState<SidebarCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      setLoading(true);
      setError(null);

      const transformedCategories = transformCategoriesToSidebar(mockData);

      // Add "All Categories" option at the beginning
      const allCategoriesOption: SidebarCategory = {
        id: "all",
        name: "All Categories",
        slug: "all",
      };

      setCategories([allCategoriesOption, ...transformedCategories]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to process categories"
      );
      console.error("Error processing categories:", err);
    } finally {
      setLoading(false);
    }
  }, [mockData]);

  return {
    categories,
    loading,
    error,
    refetch: () => {}, // No-op for mock data
  };
};

// Preload categories function (can be called on app startup)
export const preloadCategories = async (
  cacheTimeout: number = CACHE_TIMEOUT
): Promise<void> => {
  // If cache is still valid, no need to preload
  if (
    categoriesCache &&
    Date.now() - categoriesCache.timestamp < cacheTimeout
  ) {
    console.log("Categories already cached, skipping preload");
    return;
  }

  try {
    console.log("Preloading categories...");
    const url = buildApiUrl(API_ENDPOINTS.CATEGORIES, { per_page: 50 });
    const fetchConfig = createFetchConfig();

    const response = await fetch(url, fetchConfig);

    if (!response.ok) {
      throw new Error(`Failed to preload categories: ${response.statusText}`);
    }

    const apiCategories: ApiCategory[] = await response.json();
    const transformedCategories = transformCategoriesToSidebar(apiCategories);

    const allCategoriesOption: SidebarCategory = {
      id: "all",
      name: "All Categories",
      slug: "all",
    };

    const finalCategories = [allCategoriesOption, ...transformedCategories];

    // Cache the preloaded data
    categoriesCache = {
      categories: finalCategories,
      timestamp: Date.now(),
    };

    console.log("Categories preloaded and cached successfully");
  } catch (error) {
    console.error("Failed to preload categories:", error);
  }
};
