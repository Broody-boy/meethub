"use client";

import { useState } from "react";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { ArrowRight, Upload, Video, Pencil } from "lucide-react";
import { APP_NAME } from "@/constants";
import { useSession } from "next-auth/react";
import { TextFieldFormInput } from "@/components/form/TextFieldFormInput";

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

  const [step, setStep] = useState(1);

  const [firstName, setFirstName] = useState(defaultFirstName);
  const [lastName, setLastName] = useState(defaultLastName);
  const [profileUrl, setProfileUrl] = useState(defaultPic);

  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session } = useSession();
  const token = session?.backendToken ?? '';

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/me/profile-picture`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProfileUrl(data.profileUrl ?? data.url ?? data);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/me/profile`, {
        profileUrl,
        firstName,
        lastName,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await queryClient.invalidateQueries({ queryKey: ["profile"] });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-md rounded-2xl p-8"
      >
        {/* Header */}
        <div className="flex flex-col items-center gap-3">
          
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <Video />
            </div>
            <div className="text-xl font-semibold">
              {APP_NAME}
            </div>
          </div>

          {/* Progress */}
          <div className="flex gap-2 mt-2">
            <div
              className={`h-1 w-10 rounded-full ${
                step === 1 ? "bg-blue-600" : "bg-gray-300"
              }`}
            />
            <div
              className={`h-1 w-10 rounded-full ${
                step === 2 ? "bg-blue-600" : "bg-gray-300"
              }`}
            />
          </div>
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <div className="flex flex-col gap-6 mt-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold">
                Tell us your name
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                This is how you will appear in meetings
              </p>
            </div>

            {/* Inputs */}
            <div className="flex flex-col gap-4">
              {/* <input
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="h-12 rounded-lg bg-muted px-4 text-sm outline-none"
              />

              <input
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="h-12 rounded-lg bg-muted px-4 text-sm outline-none"
              /> */}

              <TextFieldFormInput 
                label="First Name"
                placeholder="First Name"
                required={true}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />


              <TextFieldFormInput 
                label="Last Name"
                placeholder="Last Name"
                required={true}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            {/* Next */}
            <Button
              className="w-full h-12 text-base"
              onClick={() => setStep(2)}
              disabled={!firstName}
            >
              Next <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="flex flex-col gap-6 mt-6 items-center">
            <div className="text-center">
              <h2 className="text-xl font-semibold">
                Add a profile photo
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Help others recognize you during meetings
              </p>
            </div>

            {/* Avatar Upload */}
            <div className="relative">
              <Avatar className="w-28 h-28 cursor-pointer">
                <AvatarImage
                  src={profileUrl || "/default-avatar.png"}
                />
                <AvatarFallback>
                  {firstName?.[0]}
                  {lastName?.[0]}
                </AvatarFallback>
              </Avatar>

              {/* Floating upload button */}
              <label
                htmlFor="photo-upload"
                className="absolute bottom-0 right-0"
              >
                <div className="bg-blue-600 text-white rounded-full p-2 cursor-pointer shadow">
                  <Pencil className="h-5 w-5" />
                </div>
              </label>

              <input
                id="photo-upload"
                type="file"
                className="hidden"
                onChange={handlePhotoUpload}
              />
            </div>

            <Button
              variant="secondary"
              className="w-full"
              disabled={isUploading}
              asChild
            >
              <label htmlFor="photo-upload" className="cursor-pointer flex items-center gap-2 justify-center">
                <Upload className="w-4 h-4" />
                {isUploading ? "Uploading..." : "Upload Photo"}
              </label>
            </Button>

            {/* Footer buttons */}
            <div className="flex w-full justify-between items-center mt-2">
              <button
                className="text-sm text-blue-600"
                onClick={() => setStep(1)}
              >
                Back
              </button>

              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || isUploading}
                className="px-6"
              >
                {isSubmitting ? "Saving..." : "Finish"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}