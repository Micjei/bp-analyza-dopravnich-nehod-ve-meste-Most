import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    console.log("📡 Načítání dat...");

    const [measurementsResponse, radarsResponse] = await Promise.all([
      fetch("https://pclazur.fit.vutbr.cz/mereni.geojson"),
      fetch("https://pclazur.fit.vutbr.cz/radary.geojson"),
    ]);

    console.log(
      "📊 Stav odpovědí:",
      measurementsResponse.status,
      radarsResponse.status
    );

    if (!measurementsResponse.ok || !radarsResponse.ok) {
      return NextResponse.json(
        { error: "Nepodařilo se načíst data" },
        { status: 500 }
      );
    }

    const measurementsData = await measurementsResponse.json();
    const radarsData = await radarsResponse.json();

    console.log("✅ Data načtena úspěšně (radary).");

    return NextResponse.json(
      { measurements: measurementsData, radars: radarsData },
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
