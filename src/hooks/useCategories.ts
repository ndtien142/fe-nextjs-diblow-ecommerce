"use client";

import { useState, useEffect } from "react";
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

export const useCategories = (): UseCategoriesReturn => {
  const [categories, setCategories] = useState<SidebarCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
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

      setCategories([allCategoriesOption, ...transformedCategories]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch categories"
      );
      console.error("Error fetching categories:", err);

      // Fallback to default categories if API fails
      setCategories([
        { id: "all", name: "All Categories", slug: "all" },
        {
          id: "loading-error",
          name: "Unable to load categories",
          slug: "error",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
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
