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

    // Build query string for popular products
    // WooCommerce doesn't have a direct "popular" endpoint, so we'll use:
    // 1. orderby=popularity (based on sales)
    // 2. featured products
    // 3. products with high rating
    const queryParams = new URLSearchParams({
      per_page,
      orderby: "popularity", // Orders by total sales
      order: "desc",
      status: "publish",
      stock_status: "instock",
    });

    console.log(
      "Fetching popular products with params:",
      queryParams.toString()
    );

    const response = await fetch(
      `${baseUrl}/wp-json/wc/v3/products?${queryParams}`,
      {
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/json",
        },
        cache: "no-store", // Disable caching for debugging
      }
    );

    console.log("WooCommerce Popular Products API Response:", {
      status: response.status,
      statusText: response.statusText,
      url: response.url,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `WooCommerce API error: ${response.status} ${response.statusText}`,
        errorText
      );
      return NextResponse.json(
        {
          error: `Failed to fetch popular products: ${response.statusText}`,
          details: errorText,
          status: response.status,
        },
        { status: response.status }
      );
    }

    const products = await response.json();

    console.log(
      "Popular products fetched successfully:",
      products.length || "Unknown count"
    );

    // Return the products with proper headers
    return NextResponse.json(products, {
      headers: {
        "Cache-Control": "no-cache", // Disable caching for debugging
      },
    });
  } catch (error) {
    console.error("Error fetching popular products:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
