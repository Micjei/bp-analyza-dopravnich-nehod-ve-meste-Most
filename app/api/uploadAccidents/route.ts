import { handleGeoJSONPost } from "@/lib/geojsonHandler";
import { saveAccidentsGeoJSON } from "@/lib/firestore";

export async function POST(req: Request) {
  return handleGeoJSONPost(req, saveAccidentsGeoJSON, "nehody");
}
