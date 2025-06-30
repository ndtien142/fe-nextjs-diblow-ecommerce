import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Get WooCommerce credentials from environment variables
    const baseUrl = process.env.WOOCOMMERCE_BASE_URL;
    const consumerKey = process.env.WOOCOMMERCE_CUSTOMER_KEY;
    const consumerSecret = process.env.WOOCOMMERCE_CUSTOMER_SECRET;

    // Debug logging (remove in production)
    console.log("Environment check:", {
      hasBaseUrl: !!baseUrl,
      hasConsumerKey: !!consumerKey,
      hasConsumerSecret: !!consumerSecret,
      baseUrl: baseUrl,
      consumerKeyLength: consumerKey?.length,
      consumerSecretLength: consumerSecret?.length,
    });

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
    const page = searchParams.get("page") || "1";
    const per_page = searchParams.get("per_page") || "20";
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";

    // Build query string for WooCommerce API
    const queryParams = new URLSearchParams({
      page,
      per_page,
      ...(search && { search }),
      ...(category && { category }),
    });

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

    console.log("WooCommerce API Response:", {
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
          error: `Failed to fetch products: ${response.statusText}`,
          details: errorText,
          status: response.status,
        },
        { status: response.status }
      );
    }

    const products = await response.json();

    console.log(
      "Products fetched successfully:",
      products.length || "Unknown count"
    );

    // Return the products with proper headers
    return NextResponse.json(products, {
      headers: {
        "Cache-Control": "no-cache", // Disable caching for debugging
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
