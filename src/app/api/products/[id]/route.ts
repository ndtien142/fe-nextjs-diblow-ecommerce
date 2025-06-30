import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = id;

    // Get WooCommerce credentials from environment variables
    const baseUrl = process.env.WOOCOMMERCE_BASE_URL;
    const consumerKey = process.env.WOOCOMMERCE_CUSTOMER_KEY;
    const consumerSecret = process.env.WOOCOMMERCE_CUSTOMER_SECRET;

    if (!baseUrl || !consumerKey || !consumerSecret) {
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

    const response = await fetch(
      `${baseUrl}/wp-json/wc/v3/products/${productId}`,
      {
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/json",
        },
        // Add cache control for better performance
        next: { revalidate: 300 }, // Cache for 5 minutes
      }
    );

    if (!response.ok) {
      console.error(
        `WooCommerce API error: ${response.status} ${response.statusText}`
      );
      return NextResponse.json(
        { error: `Failed to fetch product: ${response.statusText}` },
        { status: response.status }
      );
    }

    const product = await response.json();

    // Return the product with proper headers
    return NextResponse.json(product, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
