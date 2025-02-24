import { handleGeoJSONPost } from "@/lib/geojsonHandler";
import { saveRadarsGeoJSON } from "@/lib/firestore";

export async function POST(req: Request) {
  return handleGeoJSONPost(req, saveRadarsGeoJSON, "radary");
}
