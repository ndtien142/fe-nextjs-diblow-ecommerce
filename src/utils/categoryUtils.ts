import { ApiCategory, SidebarCategory } from "@/types/categories.interface";

/**
 * Transforms API categories into sidebar category format with proper parent-child relationships
 */
export const transformCategoriesToSidebar = (
  apiCategories: ApiCategory[]
): SidebarCategory[] => {
  // Create a map for quick lookup
  const categoryMap = new Map<number, SidebarCategory>();

  // First pass: Create all categories
  apiCategories.forEach((apiCat) => {
    categoryMap.set(apiCat.id, {
      id: apiCat.id.toString(),
      name: apiCat.name,
      slug: apiCat.slug,
      parent: apiCat.parent > 0 ? apiCat.parent.toString() : undefined,
      count: apiCat.count,
      menu_order: apiCat.menu_order,
      subcategories: [],
    });
  });

  // Second pass: Build parent-child relationships
  const rootCategories: SidebarCategory[] = [];

  categoryMap.forEach((category) => {
    if (category.parent) {
      // This is a subcategory
      const parentCategory = categoryMap.get(parseInt(category.parent));
      if (parentCategory) {
        if (!parentCategory.subcategories) {
          parentCategory.subcategories = [];
        }
        parentCategory.subcategories.push(category);
      }
    } else {
      // This is a root category
      rootCategories.push(category);
    }
  });

  // Sort categories by menu_order
  const sortCategories = (categories: SidebarCategory[]) => {
    categories.sort((a, b) => {
      const orderA = a.menu_order || 0;
      const orderB = b.menu_order || 0;
      return orderA - orderB;
    });
    categories.forEach((cat) => {
      if (cat.subcategories && cat.subcategories.length > 0) {
        sortCategories(cat.subcategories);
      }
    });
  };

  sortCategories(rootCategories);

  return rootCategories;
};

/**
 * Flattens category tree to get all category IDs for filtering
 */
export const flattenCategoryIds = (categories: SidebarCategory[]): string[] => {
  const ids: string[] = [];

  const traverse = (cats: SidebarCategory[]) => {
    cats.forEach((cat) => {
      ids.push(cat.id);
      if (cat.subcategories && cat.subcategories.length > 0) {
        traverse(cat.subcategories);
      }
    });
  };

  traverse(categories);
  return ids;
};

/**
 * Finds a category by ID in the category tree
 */
export const findCategoryById = (
  categories: SidebarCategory[],
  id: string
): SidebarCategory | null => {
  for (const cat of categories) {
    if (cat.id === id) {
      return cat;
    }
    if (cat.subcategories && cat.subcategories.length > 0) {
      const found = findCategoryById(cat.subcategories, id);
      if (found) return found;
    }
  }
  return null;
};

/**
 * Gets all child category IDs for a given category
 */
export const getChildCategoryIds = (
  categories: SidebarCategory[],
  parentId: string
): string[] => {
  const parent = findCategoryById(categories, parentId);
  if (!parent || !parent.subcategories) return [parentId];

  const childIds: string[] = [parentId];

  const traverse = (cats: SidebarCategory[]) => {
    cats.forEach((cat) => {
      childIds.push(cat.id);
      if (cat.subcategories && cat.subcategories.length > 0) {
        traverse(cat.subcategories);
      }
    });
  };

  traverse(parent.subcategories);
  return childIds;
};
