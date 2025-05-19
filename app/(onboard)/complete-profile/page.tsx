"use client";
import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
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
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { MultiSelect } from "@/components/ui/multi-select";
import { Loader2 } from "lucide-react";
import { Gender, User } from "@/types/user";
import api from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const interestOptions = [
  { label: "Technology", value: "technology" },
  { label: "Sports", value: "sports" },
  { label: "Music", value: "music" },
  { label: "Art", value: "art" },
  { label: "Travel", value: "travel" },
  { label: "Food", value: "food" },
  { label: "Reading", value: "reading" },
];

const hobbyOptions = [
  { label: "Coding", value: "coding" },
  { label: "Photography", value: "photography" },
  { label: "Cooking", value: "cooking" },
  { label: "Gaming", value: "gaming" },
  { label: "Hiking", value: "hiking" },
  { label: "Writing", value: "writing" },
  { label: "Gardening", value: "gardening" },
];

export default function CompleteProfilePage() {
  const { user, setUser } = useAuthStore();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<Partial<User>>({
    username: user?.username || "",
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    gender: user?.gender || Gender.MALE,
    dateOfBirth: user?.dateOfBirth || new Date(),
    location: user?.location || "",
    hobbies: user?.hobbies || [],
    interests: user?.interests || [],
    bio: user?.bio || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string | string[]) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGenderChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      gender: value as Gender,
    }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await api.put(`/profile/update`, formData);
      setUser({ ...user, ...response.data });
      toast.success("Profile updated successfully!");
      router.push("/feed");
    } catch (err) {
      toast.error("Profile update failed");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <div className="py-10 max-w-4xl mx-auto px-4">
      <Card className="shadow-md">
        <CardHeader className="bg-gray-50 rounded-t-lg">
          <CardTitle className="text-2xl font-bold text-primary">
            Complete Your Profile
          </CardTitle>
          <CardDescription>
            Tell us more about yourself to personalize your experience
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Avatar */}
            {/* <div className="flex flex-col items-center mb-6">
              <Avatar className="h-24 w-24 border border-gray-200 shadow-sm">
                <AvatarImage src={user?.avatar || ""} />
                <AvatarFallback className="bg-primary text-white font-medium">
                  {user.firstName?.[0] || user.username?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
              <p className="text-sm text-gray-500 mt-2">
                Profile picture can be updated separately
              </p>
            </div>

            <Separator /> */}

            {/* Basic Info */}
            <div>
              <h3 className="text-lg font-medium mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="Your first name"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Your last name"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    name="dateOfBirth"
                    value={
                      formData.dateOfBirth
                        ? new Date(formData.dateOfBirth)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    placeholder="City, Country"
                    value={formData.location}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Gender Selection */}
            <div className="space-y-3">
              <Label htmlFor="gender">Gender</Label>
              <Select
                value={formData.gender as Gender}
                onValueChange={handleGenderChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={Gender.MALE}>Male</SelectItem>
                  <SelectItem value={Gender.FEMALE}>Female</SelectItem>
                  <SelectItem value={Gender.OTHER}>Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {/* Interests & Hobbies */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Interests & Hobbies</h3>
              <div className="space-y-3">
                <Label htmlFor="interests">Interests</Label>
                <MultiSelect
                  options={interestOptions}
                  selected={formData.interests as string[]}
                  onChange={(val) => handleSelectChange("interests", val)}
                  placeholder="Select your interests"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="hobbies">Hobbies</Label>
                <MultiSelect
                  options={hobbyOptions}
                  selected={formData.hobbies as string[]}
                  onChange={(val) => handleSelectChange("hobbies", val)}
                  placeholder="Select your hobbies"
                />
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-3">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                placeholder="Tell us a bit about yourself..."
                onChange={handleChange}
                className="resize-none min-h-[120px]"
              />
            </div>

            <Separator />

            {/* Submit */}
            <CardFooter className="flex justify-end pt-6">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    Saving...
                  </>
                ) : (
                  "Update Profile"
                )}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
