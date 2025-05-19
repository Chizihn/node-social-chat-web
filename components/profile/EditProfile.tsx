import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import React from "react";

type EditProfileFormProps = {
  formData: {
    firstName: string;
    lastName: string;
    bio: string;
    location: string;
    dateOfBirth: Date;
    isPrivate?: boolean;
    // website?: string;
  };
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onPrivacyToggle: (isPrivate: boolean) => void;
  disabled: boolean;
};

const EditProfileForm: React.FC<EditProfileFormProps> = ({
  formData,
  handleInputChange,
  onPrivacyToggle,
  disabled,
}) => {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>

          <Input
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={handleInputChange}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          name="location"
          value={formData.location}
          onChange={handleInputChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="dob">Date of Birth</Label>
        <Input
          id="dob"
          name="dateOfBirth"
          type="date"
          value={new Date(formData.dateOfBirth).toLocaleDateString()}
          onChange={handleInputChange}
        />
      </div>

      <div className="flex items-center justify-between space-y-2">
        <div>
          <Label>Make Account Private</Label>
          <p className="text-sm text-muted-foreground">
            Only approved followers can see your posts
          </p>
        </div>
        <Switch
          id="isPrivate"
          name="isPrivate"
          checked={formData.isPrivate}
          onCheckedChange={onPrivacyToggle}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default EditProfileForm;
