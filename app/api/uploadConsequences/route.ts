import { handleGeoJSONPost } from "@/lib/geojsonHandler";
import { saveConsequencesGeoJSON } from "@/lib/firestore";

export async function POST(req: Request) {
  return handleGeoJSONPost(req, saveConsequencesGeoJSON, "nasledky");
}
