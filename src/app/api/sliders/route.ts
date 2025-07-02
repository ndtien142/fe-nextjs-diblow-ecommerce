import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const per_page = searchParams.get("per_page") || "10";

    // Use the specific API URL provided
    const url = new URL("https://ndtien142.xyz/wp-json/wp/v2/home-slider");
    url.searchParams.append("acf_format", "standard");
    url.searchParams.append("per_page", per_page);
    url.searchParams.append("status", "publish");
    url.searchParams.append("_embed", "true");

    console.log("Fetching sliders from WordPress API:", url.toString());

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      throw new Error(
        `WordPress API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    console.log(`Successfully fetched ${data.length} sliders`);

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("Error in slider API route:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch sliders",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
