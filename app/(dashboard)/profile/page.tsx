"use client";
import { useState, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { useGetUserPosts } from "@/lib/queries/usePost";
import PostList from "@/components/feed/PostList";
import { useLikedItems } from "@/lib/queries/useLike";
import EditProfileForm from "../../../components/profile/EditProfile";
import UserMedia from "@/components/profile/UserMediaList";
import UserCover from "@/components/profile/UserCover";
import UserAvatar from "@/components/profile/UserAvatar";
import UserInfo from "@/components/profile/UserInfo";
import { User } from "@/types/user";
import { Edit3 } from "lucide-react";
import api from "@/lib/api";
import { useTogglePrivacy } from "@/lib/queries/useProfile";
import { useCloudinaryUpload } from "@/hooks/useCloudinaryUpload";

const ProfilePage = () => {
  const user = useAuthStore((state) => state.user);
  const { posts, isLoading, error, currentPage, totalPages, handlePageChange } =
    useGetUserPosts(user?.username as string);

  const { togglePrivacy, isLoading: isTogglingPrivacy } = useTogglePrivacy();

  const { likedItems } = useLikedItems({ type: "Post" });

  // Extract liked post IDs as a Set for fast lookup
  const likedPostIds = useMemo(
    () => new Set(likedItems.map((item) => item.targetId)),
    [likedItems]
  );

  const filteredLikedPosts = posts.filter((post) => likedPostIds.has(post.id));

  const updateUser = useAuthStore((state) => state.setUser);

  // File input refs
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // Initialize Cloudinary upload hooks for avatar and cover image
  const { uploadFile: uploadAvatar, uploadState: avatarUploadState } =
    useCloudinaryUpload({
      maxSizeMB: 5,
      allowedTypes: ["image/*"],
      maxFiles: 1,
    });

  const { uploadFile: uploadCover, uploadState: coverUploadState } =
    useCloudinaryUpload({
      maxSizeMB: 10,
      allowedTypes: ["image/*"],
      maxFiles: 1,
    });

  // Loading states
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  // Edit profile dialog state
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    bio: user?.bio || "",
    location: user?.location || "",
    dateOfBirth: user?.dateOfBirth || new Date(Date.now()),
    isPrivate: user?.isPrivate || false,
  });

  // Handle input change for profile edit form
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle avatar upload using Cloudinary
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];

    try {
      // Upload to Cloudinary
      const result = await uploadAvatar(file);

      // Update avatar in the backend
      await api.put("/profile/update", {
        avatar: result.url,
      });

      // Update local state with the returned avatar URL
      updateUser({ ...user, avatar: result.url });
      toast.success("Profile picture updated successfully");
    } catch (error) {
      console.error("Avatar upload error:", error);
      toast.error(
        avatarUploadState.error || "Failed to update profile picture"
      );
    }
  };

  // Handle cover image upload using Cloudinary
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];

    try {
      // Upload to Cloudinary
      const result = await uploadCover(file);

      // Update cover image in the backend
      await api.put("/profile/update", {
        coverImage: result.url,
      });

      // Update local state with the returned cover URL
      updateUser({ ...user, coverImage: result.url });
      toast.success("Cover image updated successfully");
    } catch (error) {
      console.error("Cover upload error:", error);
      toast.error(coverUploadState.error || "Failed to update cover image");
    }
  };

  // Handle privacy toggle
  const handlePrivacyToggle = async () => {
    try {
      await togglePrivacy();
      toast.success("Privacy settings updated successfully");
    } catch (error) {
      toast.error(
        (error as Error).message || "Failed to update privacy settings"
      );
    }
  };

  // Handle profile update
  const handleProfileUpdate = async () => {
    try {
      setIsLoadingProfile(true);

      // Send updated profile data to API
      const { ...profileData } = formData;
      await api.put(`/profile/update`, profileData);

      // Update local state
      updateUser({ ...user, ...profileData });

      setIsEditDialogOpen(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsLoadingProfile(false);
    }
  };

  return (
    <div className="">
      {/* Cover Photo */}
      <UserCover
        coverImage={user?.coverImage}
        isLoading={coverUploadState.isUploading}
        onClick={() => coverInputRef.current?.click()}
        inputRef={coverInputRef}
        onChange={handleCoverUpload}
      />

      <div className="px-4">
        {/* Profile Info */}
        <div className="relative -mt-16 mb-4 flex justify-between items-end">
          <UserAvatar
            avatar={user?.avatar}
            username={user?.username}
            isLoading={avatarUploadState.isUploading}
            inputRef={avatarInputRef}
            onChange={handleAvatarUpload}
            onClick={() => avatarInputRef.current?.click()}
          />
          <Button className="h-10" onClick={() => setIsEditDialogOpen(true)}>
            <Edit3 className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </div>
        {/* User Info Section */}
        <UserInfo user={user as User} />
        {/* Tabs */}
        <Tabs defaultValue="posts" className="mt-6">
          <TabsList className="grid grid-cols-4 w-full max-w-md">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="likes">Likes</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>

          {/* Posts Tab */}
          <div className="px-4">
            <TabsContent value="posts" className="mt-4">
              <PostList
                posts={posts}
                loading={isLoading}
                error={error?.message}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </TabsContent>

            <TabsContent value="media">
              <UserMedia posts={posts} />
            </TabsContent>

            <TabsContent value="likes">
              <div>
                <PostList
                  posts={filteredLikedPosts}
                  message=" Posts you've liked will appear here"
                />
              </div>
            </TabsContent>

            <TabsContent value="about">
              <div className="mt-4 space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Bio</h3>
                  <p className="text-muted-foreground">
                    {user?.bio || "Add a bio to tell the world about yourself."}
                  </p>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Location</h3>
                  <p className="text-muted-foreground">
                    {user?.location || "Not specified"}
                  </p>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <EditProfileForm
            formData={formData}
            handleInputChange={handleInputChange}
            onPrivacyToggle={handlePrivacyToggle}
            disabled={isTogglingPrivacy}
          />

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleProfileUpdate} disabled={isLoadingProfile}>
              {isLoadingProfile ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfilePage;
