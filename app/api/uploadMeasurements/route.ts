import { handleGeoJSONPost } from "@/lib/geojsonHandler";
import { saveMeasurementGeoJSON } from "@/lib/firestore";

export async function POST(req: Request) {
  return handleGeoJSONPost(req, saveMeasurementGeoJSON, "mereni");
}
