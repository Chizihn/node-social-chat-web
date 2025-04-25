import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import React from "react";

type EditProfileFormProps = {
  formData: {
    firstName: string;
    lastName: string;
    bio: string;
    location: string;
    // website?: string;
  };
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
};

const EditProfileForm: React.FC<EditProfileFormProps> = ({
  formData,
  handleInputChange,
}) => {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name</Label>

          <Input
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={handleInputChange}
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          name="location"
          value={formData.location}
          onChange={handleInputChange}
        />
      </div>

      {/* Uncomment if needed
      <div>
        <Label htmlFor="website">Website</Label>
        <Input
          id="website"
          name="website"
          value={formData.website}
          onChange={handleInputChange}
        />
      </div>
      */}
    </div>
  );
};

export default EditProfileForm;
