import { NextRequest, NextResponse } from "next/server";

// Handler for GET requests to fetch radar-related data
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    console.log("📡 Loading radar data...");

    // Perform both fetches in parallel: radar measurements and radar metadata
    const [measurementsResponse, radarsResponse] = await Promise.all([
      fetch("https://pclazur.fit.vutbr.cz/mereni.geojson"),
      fetch("https://pclazur.fit.vutbr.cz/radary.geojson"),
    ]);

    // Log HTTP status codes for debugging
    console.log(
      "📊 Response statuses:",
      measurementsResponse.status,
      radarsResponse.status
    );

    // Check if either fetch failed
    if (!measurementsResponse.ok || !radarsResponse.ok) {
      return NextResponse.json(
        { error: "Failed to load radar or measurement data" },
        { status: 500 }
      );
    }

    // Parse both responses into JSON
    const measurementsData = await measurementsResponse.json();
    const radarsData = await radarsResponse.json();

    console.log("✅ Radar data loaded successfully.");

    // Return the combined data as JSON
    return NextResponse.json(
      { measurements: measurementsData, radars: radarsData },
      { status: 200 }
    );
  } catch (error: any) {
    // Log and return any unexpected error
    console.error("🚨 Error while loading radar data:", error);
    return NextResponse.json(
      { error: "An error occurred while loading data", details: error.message },
      { status: 500 }
    );
  }
}
