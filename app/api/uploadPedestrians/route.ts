import { handleGeoJSONPost } from "@/lib/geojsonHandler";
import { savePedestriansGeoJSON } from "@/lib/firestore";

export async function POST(req: Request) {
  return handleGeoJSONPost(req, savePedestriansGeoJSON, "chodci");
}
