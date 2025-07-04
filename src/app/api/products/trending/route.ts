import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Get WooCommerce credentials from environment variables
    const baseUrl = process.env.WOOCOMMERCE_BASE_URL;
    const consumerKey = process.env.WOOCOMMERCE_CUSTOMER_KEY;
    const consumerSecret = process.env.WOOCOMMERCE_CUSTOMER_SECRET;

    if (!baseUrl || !consumerKey || !consumerSecret) {
      console.error("Missing WooCommerce configuration");
      return NextResponse.json(
        { error: "WooCommerce configuration not complete" },
        { status: 500 }
      );
    }

    // Create basic auth header
    const credentials = Buffer.from(
      `${consumerKey}:${consumerSecret}`,
      "utf-8"
    ).toString("base64");

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const per_page = searchParams.get("per_page") || "8";

    // Strategy 1: Get featured products
    const featuredParams = new URLSearchParams({
      per_page: "20",
      featured: "true",
      status: "publish",
      stock_status: "instock",
    });

    // Strategy 2: Get products by popularity (sales)
    const popularParams = new URLSearchParams({
      per_page: "20",
      orderby: "popularity",
      order: "desc",
      status: "publish",
      stock_status: "instock",
    });

    // Strategy 3: Get top rated products
    const topRatedParams = new URLSearchParams({
      per_page: "20",
      orderby: "rating",
      order: "desc",
      status: "publish",
      stock_status: "instock",
    });

    // Fetch from all three strategies
    const [featuredResponse, popularResponse, topRatedResponse] =
      await Promise.all([
        fetch(`${baseUrl}/wp-json/wc/v3/products?${featuredParams}`, {
          headers: {
            Authorization: `Basic ${credentials}`,
            "Content-Type": "application/json",
          },
          cache: "no-store",
        }),
        fetch(`${baseUrl}/wp-json/wc/v3/products?${popularParams}`, {
          headers: {
            Authorization: `Basic ${credentials}`,
            "Content-Type": "application/json",
          },
          cache: "no-store",
        }),
        fetch(`${baseUrl}/wp-json/wc/v3/products?${topRatedParams}`, {
          headers: {
            Authorization: `Basic ${credentials}`,
            "Content-Type": "application/json",
          },
          cache: "no-store",
        }),
      ]);

    // Parse responses
    const featuredProducts = featuredResponse.ok
      ? await featuredResponse.json()
      : [];
    const popularProducts = popularResponse.ok
      ? await popularResponse.json()
      : [];
    const topRatedProducts = topRatedResponse.ok
      ? await topRatedResponse.json()
      : [];

    // Combine and deduplicate products
    const allProducts = [
      ...featuredProducts,
      ...popularProducts,
      ...topRatedProducts,
    ];
    const uniqueProducts = allProducts.filter(
      (product, index, self) =>
        index === self.findIndex((p) => p.id === product.id)
    );

    // Score products based on multiple factors
    const scoredProducts = uniqueProducts.map((product) => {
      let score = 0;

      // Featured products get bonus points
      if (product.featured) score += 10;

      // Sales count (total_sales)
      score += (product.total_sales || 0) * 0.1;

      // Rating score
      const rating = parseFloat(product.average_rating || "0");
      const ratingCount = product.rating_count || 0;
      score += rating * ratingCount * 0.2;

      // Recent products get slight bonus
      const createdDate = new Date(product.date_created);
      const daysSinceCreated =
        (Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceCreated < 30) score += 5; // Bonus for products created in last 30 days

      return {
        ...product,
        popularity_score: score,
      };
    });

    // Sort by score and limit results
    const trendingProducts = scoredProducts
      .sort((a, b) => b.popularity_score - a.popularity_score)
      .slice(0, parseInt(per_page));

    return NextResponse.json(trendingProducts, {
      headers: {
        "Cache-Control": "public, s-maxage=1800", // Cache for 30 minutes
      },
    });
  } catch (error) {
    console.error("Error fetching trending products:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
