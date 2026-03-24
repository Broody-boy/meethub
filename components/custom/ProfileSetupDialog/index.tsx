"use client";

import { useState } from "react";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface ProfileSetupDialogProps {
  open: boolean;
  defaultFirstName?: string;
  defaultLastName?: string;
  defaultPic?: string;
}

export function ProfileSetupDialog({
  open,
  defaultFirstName = "",
  defaultLastName = "",
  defaultPic = "",
}: ProfileSetupDialogProps) {
  const queryClient = useQueryClient();

  const [firstName, setFirstName] = useState(defaultFirstName);
  const [lastName, setLastName] = useState(defaultLastName);
  const [profileUrl, setProfileUrl] = useState(defaultPic);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/profile-picture`,
        formData
      );

      setProfileUrl(data.profileUrl ?? data.url ?? data);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/profile`, {
        profileUrl,
        firstName,
        lastName,
      });
      await queryClient.invalidateQueries({ queryKey: ["profile"] });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent showCloseButton={false} className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Complete your profile</DialogTitle>
        </DialogHeader>

        {/* Profile pic */}
        <div className="flex flex-col items-center gap-3 py-2">
          <Avatar className="w-20 h-20">
            <AvatarImage src={profileUrl || "/default-avatar.png"} alt="Profile" />
            <AvatarFallback>
              {firstName?.[0]}
              {lastName?.[0]}
            </AvatarFallback>
          </Avatar>

          <label htmlFor="photo-upload">
            <Button
              variant="outline"
              size="sm"
              disabled={isUploading}
              asChild
            >
              <span className="cursor-pointer">
                {isUploading ? "Uploading..." : "Upload photo"}
              </span>
            </Button>
          </label>
          <input
            id="photo-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoUpload}
            disabled={isUploading}
          />
        </div>

        {/* Name fields */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label htmlFor="first-name" className="text-sm font-medium">
              First name
            </label>
            <input
              id="first-name"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="last-name" className="text-sm font-medium">
              Last name
            </label>
            <input
              id="last-name"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || isUploading}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? "Saving..." : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
