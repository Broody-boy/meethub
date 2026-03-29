// Custom imports
import { client as googleClient} from "../config/index.js";

export async function verifyGoogleToken(idToken) {
  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  
  // return ticket.getPayload();

  return {
    id: payload.sub,
    email: payload.email,
    name: payload.name,
  };
}