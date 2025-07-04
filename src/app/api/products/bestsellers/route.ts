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

    // Get query parameters from the request URL
    const { searchParams } = new URL(request.url);
    const per_page = searchParams.get("per_page") || "10";

    // Get best selling products based on total sales
    const queryParams = new URLSearchParams({
      per_page,
      orderby: "popularity", // This orders by total_sales in WooCommerce
      order: "desc",
      status: "publish",
      stock_status: "instock",
      meta_key: "total_sales", // Ensure we're sorting by sales
    });

    const response = await fetch(
      `${baseUrl}/wp-json/wc/v3/products?${queryParams}`,
      {
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `WooCommerce API error: ${response.status} ${response.statusText}`,
        errorText
      );
      return NextResponse.json(
        {
          error: `Failed to fetch best selling products: ${response.statusText}`,
          details: errorText,
          status: response.status,
        },
        { status: response.status }
      );
    }

    const products = await response.json();

    // Add sales ranking to products
    const rankedProducts = products.map((product: any, index: number) => ({
      ...product,
      sales_rank: index + 1,
      is_bestseller: index < 5, // Top 5 are marked as bestsellers
    }));

    return NextResponse.json(rankedProducts, {
      headers: {
        "Cache-Control": "public, s-maxage=3600", // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error("Error fetching best selling products:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
