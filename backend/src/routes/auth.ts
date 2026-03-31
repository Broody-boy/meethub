// Third-party imports
import express from "express";
import { verifyGoogleToken } from "../utils/index";

// Custom imports
import jwt from "jsonwebtoken";
import { prisma } from "../config";

const router = express.Router();

router.post("/oauth", async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ message: "Missing idToken" });
  }

  try {
    const user = await verifyGoogleToken(idToken);

    const dbUser = await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: { email: user.email },
    });

    const appUser = {
      id: dbUser.clientId,
      email: dbUser.email,
      name: user.name,
    };

    const token = jwt.sign(appUser, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.json({ token });
  } catch (err) {
    console.error("Google auth error:", err);
    return res.status(401).json({ message: "Invalid Google token" });
  }
});

export default router;