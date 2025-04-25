"use client";
import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import axios from "axios";
import { API_URL } from "@/constants";
import { toast } from "sonner";

// UI Components
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { MultiSelect } from "@/components/ui/multi-select";
import { Loader2, Camera } from "lucide-react";
import { Gender, User } from "@/types/user";

// Dummy options
const interestOptions = [
  { label: "Technology", value: "technology" },
  { label: "Sports", value: "sports" },
  { label: "Music", value: "music" },
];
const hobbyOptions = [
  { label: "Coding", value: "coding" },
  { label: "Photography", value: "photography" },
  { label: "Cooking", value: "cooking" },
];

export default function CompleteProfilePage() {
  const { user, token, setUser } = useAuthStore();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    user?.avatar || null
  );
  const [isUploading, setIsUploading] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Partial<User>>({
    username: user?.username || "",
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    gender: user?.gender || Gender.MALE,
    dateOfBirth: user?.dateOfBirth || "",
    location: user?.location || "",
    hobbies: user?.hobbies || [],
    interests: user?.interests || [],
    bio: user?.bio || "",
    isPrivate: user?.isPrivate || false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    // Narrow to HTMLInputElement if it's a checkbox
    const input = e.target as HTMLInputElement;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? input.checked : value,
    }));
  };

  const handleSelectChange = (name: string, value: string | string[]) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const uploadAvatar = async () => {
    if (!avatarFile) return null;
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("avatar", avatarFile);

      const response = await axios.post(`${API_URL}/profile/avatar`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Avatar uploaded!");
      return response.data.avatarUrl;
    } catch {
      toast.error("Avatar upload failed");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let avatarUrl = null;
      if (avatarFile) {
        avatarUrl = await uploadAvatar();
      }

      const profileData = {
        ...formData,
        ...(avatarUrl && { avatar: avatarUrl }),
      };

      const response = await axios.put(`${API_URL}/profile`, profileData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser({ ...user, ...response.data });
      toast.success("Profile updated!");
      router.push("/feed");
    } catch (err) {
      toast.error("Update failed");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <div className="container max-w-3xl py-10">
      <Card>
        <CardHeader>
          <CardTitle>Complete Your Profile</CardTitle>
          <CardDescription>
            Fill out your informationg to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Avatar */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative group">
                <Avatar className="h-24 w-24 border">
                  <AvatarImage src={avatarPreview || ""} />
                  <AvatarFallback>
                    {user.firstName?.[0] || user.username?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <label
                    htmlFor="avatar-upload"
                    className="cursor-pointer p-2 bg-primary text-white rounded-full"
                  >
                    <Camera className="h-5 w-5" />
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
              />
              <Input
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
              />
              <Input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
              />
              <Input
                name="location"
                placeholder="Location"
                value={formData.location}
                onChange={handleChange}
              />
              <Select
                onValueChange={(val) => handleSelectChange("gender", val)}
                defaultValue={formData.gender as string}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {/* Multi-selects */}
            <MultiSelect
              options={interestOptions}
              selected={formData.interests as string[]}
              onChange={(val) => handleSelectChange("interests", val)}
              placeholder="Select interests"
            />
            <MultiSelect
              options={hobbyOptions}
              selected={formData.hobbies as string[]}
              onChange={(val) => handleSelectChange("hobbies", val)}
              placeholder="Select hobbies"
            />

            <Textarea
              name="bio"
              value={formData.bio}
              placeholder="Short bio"
              onChange={handleChange}
              className="resize-none min-h-[120px]"
            />

            {/* Privacy checkbox */}
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="isPrivate"
                checked={formData.isPrivate}
                onChange={handleChange}
              />
              <span>Private Account</span>
            </label>

            <CardFooter className="flex justify-end px-0 pt-4">
              <Button type="submit" disabled={isSubmitting || isUploading}>
                {(isSubmitting || isUploading) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isSubmitting || isUploading ? "Saving..." : "Complete Profile"}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
