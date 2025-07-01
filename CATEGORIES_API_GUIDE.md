# API Categories Integration Guide

This guide shows how to integrate WooCommerce categories API with the Diblow sidebar component.

## Files Created/Updated

### 1. TypeScript Interfaces

- `src/types/categories.interface.ts` - Defines interfaces for API categories and sidebar categories
- Includes `ApiCategory`, `SidebarCategory`, `CategoryLinks`, etc.

### 2. Utility Functions

- `src/utils/categoryUtils.ts` - Transforms API data into sidebar format
- Functions: `transformCategoriesToSidebar`, `getChildCategoryIds`, `findCategoryById`

### 3. React Hook

- `src/hooks/useCategories.ts` - Fetches and manages category data
- `useCategories()` - Fetches from API
- `useCategoriesWithMockData()` - For testing with mock data

### 4. API Route

- `src/app/api/categories/route.ts` - Next.js API route to serve categories
- Currently returns mock data, can be modified to call external API

### 5. Updated Components

- `src/components/Sidebar.tsx` - Now supports API categories with loading states
- `src/app/all-products/page.tsx` - Improved filtering with hierarchical categories

### 6. Demo Pages

- `src/app/api-demo/page.tsx` - Shows how API categories are transformed
- `src/app/sidebar-demo/page.tsx` - Basic sidebar functionality demo

## How to Use

### Option 1: Use API Categories (Default)

```tsx
import Sidebar from "@/components/Sidebar";

function MyPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  return (
    <Sidebar
      selectedCategory={selectedCategory}
      onCategorySelect={setSelectedCategory}
      useApiCategories={true} // This is the default
    />
  );
}
```

### Option 2: Use Custom Categories

```tsx
import Sidebar from "@/components/Sidebar";
import { SidebarCategory } from "@/types/categories.interface";

const customCategories: SidebarCategory[] = [
  { id: "all", name: "All Products", slug: "all" },
  { id: "custom", name: "Custom Category", slug: "custom" },
];

function MyPage() {
  return <Sidebar categories={customCategories} useApiCategories={false} />;
}
```

### Option 3: Use Mock Data for Testing

```tsx
import { useCategoriesWithMockData } from "@/hooks/useCategories";

function TestPage() {
  const { categories, loading, error } = useCategoriesWithMockData(mockApiData);

  return <Sidebar categories={categories} useApiCategories={false} />;
}
```

## API Integration

### Connect to Real WooCommerce API

1. Update `src/app/api/categories/route.ts`:

```typescript
export async function GET(request: NextRequest) {
  try {
    const response = await fetch(
      "YOUR_WOOCOMMERCE_API_URL/wp-json/wc/v3/products/categories",
      {
        headers: {
          Authorization: "Basic " + btoa("consumer_key:consumer_secret"),
          "Content-Type": "application/json",
        },
      }
    );

    const categories = await response.json();
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
```

2. Or use the hook directly with external API:

```typescript
// In your hook or component
const fetchCategories = async () => {
  const response = await fetch("https://your-api.com/categories");
  const apiCategories = await response.json();
  return transformCategoriesToSidebar(apiCategories);
};
```

## Category Data Structure

### API Category (from WooCommerce)

```json
{
  "id": 50,
  "name": "Áo",
  "slug": "ao",
  "parent": 0,
  "description": "",
  "display": "default",
  "image": null,
  "menu_order": 12,
  "count": 0,
  "_links": {...}
}
```

### Sidebar Category (transformed)

```json
{
  "id": "50",
  "name": "Áo",
  "slug": "ao",
  "parent": undefined,
  "count": 0,
  "subcategories": [
    {
      "id": "56",
      "name": "Áo Hoodie",
      "slug": "ao-hoodie",
      "parent": "50"
    }
  ]
}
```

## Product Filtering

The filtering works by:

1. Getting all child category IDs for the selected category
2. Checking if product categories match any of these IDs
3. Fallback to name/slug matching for compatibility

```typescript
const categoryIds = getChildCategoryIds(apiCategories, selectedCategory);
const filteredProducts = products.filter((product) =>
  product.categories.some((category) =>
    categoryIds.includes(category.id.toString())
  )
);
```

## Demo Pages

- Visit `/api-demo` to see your API categories in action
- Visit `/sidebar-demo` for basic sidebar functionality
- Visit `/all-products` for the full shop experience

## Features

✅ **Hierarchical Categories** - Parent-child relationships preserved
✅ **Loading States** - Shows spinner while fetching data
✅ **Error Handling** - Graceful fallback when API fails
✅ **Mobile Responsive** - Works on all screen sizes
✅ **Expandable/Collapsible** - Categories with children can be toggled
✅ **Product Filtering** - Automatically filters products by category
✅ **Vietnamese Support** - Works with Vietnamese category names
✅ **Fallback Support** - Uses default categories if API fails

## Customization

You can customize the sidebar appearance by modifying:

- CSS classes in `Sidebar.tsx`
- Category transformation logic in `categoryUtils.ts`
- Loading states and error messages
- Default categories array

## Next Steps

1. Replace mock data with real API endpoint
2. Add category images support
3. Implement category search functionality
4. Add product count per category
5. Cache categories for better performance
