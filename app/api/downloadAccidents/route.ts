import { NextRequest, NextResponse } from "next/server";
import { fetchWithRetry } from "@/utils/fetchData";

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    console.log("📡 Načítání dat...");

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

    console.log(
      "📊 Stav odpovědí:",
      vehiclesResponse.status,
      accidentsResponse.status,
      consequencesResponse.status,
      pedestriansResponse.status
    );
    if (
      !vehiclesResponse.ok ||
      !accidentsResponse.ok ||
      !consequencesResponse.ok ||
      !pedestriansResponse.ok
    ) {
      return NextResponse.json(
        { error: "Nepodařilo se načíst data" },
        { status: 500 }
      );
    }

    const vehiclesData = await vehiclesResponse.json();
    const accidentsData = await accidentsResponse.json();
    const consequencesData = await consequencesResponse.json();
    const pedestriansData = await pedestriansResponse.json();

    console.log("✅ Data načtena úspěšně (nehody).");

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
    console.error("🚨 Chyba při načítání dat:", error);
    return NextResponse.json(
      { error: "Chyba při načítání dat", details: error.message },
      { status: 500 }
    );
  }
}
