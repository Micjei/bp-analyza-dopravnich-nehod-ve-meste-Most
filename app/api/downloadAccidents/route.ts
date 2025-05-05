import { NextRequest, NextResponse } from "next/server";
import { fetchWithRetry } from "@/utils/fetchData";

// Handler for GET requests to this API route
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    console.log("📡 Loading data...");

    // Fetch all datasets concurrently from external sources with retry logic
    const [
      vehiclesResponse,
      accidentsResponse,
      consequencesResponse,
      pedestriansResponse,
    ] = await Promise.all([
      fetchWithRetry("https://pclazur.fit.vutbr.cz/vozidla.geojson"),
      fetchWithRetry("https://pclazur.fit.vutbr.cz/nehody.geojson"),
      fetchWithRetry("https://pclazur.fit.vutbr.cz/nasledky.geojson"),
      fetchWithRetry("https://pclazur.fit.vutbr.cz/chodci.geojson"),
    ]);

    // Log status codes of responses
    console.log(
      "📊 Response statuses:",
      vehiclesResponse.status,
      accidentsResponse.status,
      consequencesResponse.status,
      pedestriansResponse.status
    );

    // Check if any request failed
    if (
      !vehiclesResponse.ok ||
      !accidentsResponse.ok ||
      !consequencesResponse.ok ||
      !pedestriansResponse.ok
    ) {
      return NextResponse.json(
        { error: "Failed to load one or more data sources" },
        { status: 500 }
      );
    }

    // Parse responses to JSON
    const vehiclesData = await vehiclesResponse.json();
    const accidentsData = await accidentsResponse.json();
    const consequencesData = await consequencesResponse.json();
    const pedestriansData = await pedestriansResponse.json();

    console.log("✅ Accident data loaded successfully.");

    // Return all datasets in a single JSON response
    return NextResponse.json(
      {
        vehicles: vehiclesData,
        accidents: accidentsData,
        consequences: consequencesData,
        pedestrians: pedestriansData,
      },
      { status: 200 }
    );
  } catch (error: any) {
    // Handle unexpected errors
    console.error("🚨 Error loading data:", error);
    return NextResponse.json(
      { error: "Error loading data", details: error.message },
      { status: 500 }
    );
  }
}
