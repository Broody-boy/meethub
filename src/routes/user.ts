import express from "express";
import { prisma } from "../config";
import { authenticate } from "../middleware/authenticate";

const router = express.Router();

router.get("/me", authenticate, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { clientId: req.user.id },
      select: {
        firstName: true,
        lastName: true,
        profileUrl: true,
        isProfileSetupComplete: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { firstName, lastName, profileUrl, isProfileSetupComplete } = user;

    const responseData = {
    isProfileSetupComplete,
    ...(firstName && { firstName }),
    ...(lastName && { lastName }),
    ...(profileUrl && { profileUrl }),
    };

    return res.json(responseData);
  } catch (err) {
    console.error("Error fetching user:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
