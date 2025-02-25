import { handleGeoJSONPost } from "@/lib/geojsonHandler";
import { saveVehiclesGeoJSON } from "@/lib/firestore";

export async function POST(req: Request) {
  return handleGeoJSONPost(req, saveVehiclesGeoJSON, "vozidla");
}
