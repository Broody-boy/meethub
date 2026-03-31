// Third party imports
import express from "express";
import multer from "multer";
import { PutObjectCommand } from "@aws-sdk/client-s3";

// Custom imports
import { getS3Client, prisma } from "../config";
import { authenticate } from "../middleware/authenticate";
import { ALLOWED_PROFILE_PIC_MIMETYPES, MAX_PERMISSIBLE_PROFILE_PIC_SIZE } from "../constants";

// Multer (memory storage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_PERMISSIBLE_PROFILE_PIC_SIZE }, // 5MB limit
});

const router = express.Router();

router.get("/", async (req, res) => {
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

router.post("/profile-picture", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const file = req.file;

    // validate image: add more checks
    if (!file.mimetype.startsWith("image/") || !ALLOWED_PROFILE_PIC_MIMETYPES.includes(file.mimetype)) {
      return res.status(400).json({ message: "Only jpg, png images allowed" });
    }

    const key = `profile-pics/${req.user.id}-${Date.now()}-${file.originalname}`;

    const s3 = getS3Client({
      endpoint: process.env.R2_ENDPOINT,
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!
    });

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.PROFILE_BUCKET_NAME,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      })
    );

    const profileUrl = `${process.env.PROFILE_BUCKET_PUBLIC_URL}/${key}`;

    return res.json({ profileUrl });
  } catch (err) {
    console.error("Error uploading profile picture:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
