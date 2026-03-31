// Custom imports
import { client as googleClient} from "../config/index";

export async function verifyGoogleToken(idToken: string) {
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