import { NextResponse } from "next/server";

export async function handleGeoJSONPost(
  req: Request,
  saveFunction: (geojson: any) => Promise<void>,
  entityName: string
) {
  try {
    const geojson = await req.json();
    if (!geojson || !geojson.features) {
      return NextResponse.json(
        { error: "Špatný formát GeoJSON" },
        { status: 400 }
      );
    }

    await saveFunction(geojson);
    return NextResponse.json(
      { message: `Uloženo ${entityName} záznamů do Firestore!` },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Chyba:", error);
    return NextResponse.json(
      { error: "Interní chyba serveru" },
      { status: 500 }
    );
  }
}
