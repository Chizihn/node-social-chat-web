"use client";

import { ChangeEvent, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Camera,
  Globe,
  Lock,
  Shield,
  UserCog,
  Bell,
  UserPlus,
  Database,
} from "lucide-react";
import Image from "next/image";

const SettingsPage = () => {
  const [formData, setFormData] = useState({
    name: "User Name",
    username: "username",
    email: "user@example.com",
    bio: "Product Designer, Photographer, and Creative Director. Always exploring new ideas and pushing boundaries.",
    website: "username.com",
    location: "San Francisco, CA",
    dateOfBirth: "1990-08-15",
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <Tabs defaultValue="account" className="w-full">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <TabsList className="flex flex-col h-auto w-full bg-background border rounded-lg p-2 gap-1">
              <TabsTrigger
                value="account"
                className="w-full justify-start gap-3 p-3"
              >
                <UserCog className="h-4 w-4" />
                Account
              </TabsTrigger>
              <TabsTrigger
                value="profile"
                className="w-full justify-start gap-3 p-3"
              >
                <UserPlus className="h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger
                value="privacy"
                className="w-full justify-start gap-3 p-3"
              >
                <Lock className="h-4 w-4" />
                Privacy
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="w-full justify-start gap-3 p-3"
              >
                <Bell className="h-4 w-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className="w-full justify-start gap-3 p-3"
              >
                <Shield className="h-4 w-4" />
                Security
              </TabsTrigger>
              <TabsTrigger
                value="data"
                className="w-full justify-start gap-3 p-3"
              >
                <Database className="h-4 w-4" />
                Data
              </TabsTrigger>
            </TabsList>

            {/* <div className="mt-6">
              <Button
                variant="destructive"
                className="w-full flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Log Out
              </Button>
            </div> */}
          </div>

          {/* Content */}
          <div className="flex-1">
            <TabsContent value="account" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>
                    Manage your account details and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Basic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          name="username"
                          value={formData.username}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      Account Preferences
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Language</p>
                          <p className="text-sm text-muted-foreground">
                            Choose your preferred language
                          </p>
                        </div>
                        <Select defaultValue="en">
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Spanish</SelectItem>
                            <SelectItem value="fr">French</SelectItem>
                            <SelectItem value="de">German</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Time Zone</p>
                          <p className="text-sm text-muted-foreground">
                            Set your local time zone
                          </p>
                        </div>
                        <Select defaultValue="pst">
                          <SelectTrigger className="w-52">
                            <SelectValue placeholder="Time Zone" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pst">
                              Pacific Time (PST)
                            </SelectItem>
                            <SelectItem value="est">
                              Eastern Time (EST)
                            </SelectItem>
                            <SelectItem value="cet">
                              Central European Time (CET)
                            </SelectItem>
                            <SelectItem value="jst">
                              Japan Standard Time (JST)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Danger Zone</h3>
                    <div>
                      <Button
                        variant="outline"
                        className="text-red-500 border-red-200 hover:bg-red-50"
                      >
                        Deactivate Account
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button variant="outline">Cancel</Button>
                  <Button>Save Changes</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="profile" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your profile information that is visible to others
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      Profile Picture & Cover Photo
                    </h3>
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          Profile Picture
                        </p>
                        <div className="relative">
                          <Avatar className="h-24 w-24">
                            <AvatarImage
                              src="/images/user.webp"
                              alt="Profile"
                            />
                            <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                              UN
                            </AvatarFallback>
                          </Avatar>
                          <Button
                            variant="outline"
                            size="icon"
                            className="absolute bottom-0 right-0 rounded-full h-8 w-8"
                          >
                            <Camera className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2 flex-1">
                        <p className="text-sm text-muted-foreground">
                          Cover Photo
                        </p>
                        <div className="relative h-24 w-full bg-accent rounded-lg overflow-hidden">
                          <div className="relative h-full w-full">
                            <Image
                              src="/images/user.webp"
                              alt="Cover"
                              fill
                              className="object-cover"
                            />
                          </div>
                          <Button
                            variant="outline"
                            className="absolute bottom-2 right-2 rounded-full bg-black/40 text-white border-white"
                          >
                            <Camera className="h-4 w-4 mr-2" />
                            Change Cover
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Display Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          name="bio"
                          rows={4}
                          value={formData.bio}
                          onChange={handleInputChange}
                        />
                        <p className="text-xs text-muted-foreground">
                          Maximum 160 characters
                        </p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                          <Label htmlFor="website">Website</Label>
                          <Input
                            id="website"
                            name="website"
                            value={formData.website}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="dob">Date of Birth</Label>
                          <Input
                            id="dob"
                            name="dateOfBirth"
                            type="date"
                            value={formData.dateOfBirth}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button variant="outline">Cancel</Button>
                  <Button>Save Changes</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="privacy" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                  <CardDescription>
                    Control who can see your content and how your information is
                    used
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Account Privacy</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Private Account</p>
                          <p className="text-sm text-muted-foreground">
                            Only approved followers can see your posts
                          </p>
                        </div>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Activity Status</p>
                          <p className="text-sm text-muted-foreground">
                            Show when you&apos;re active on the platform
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      Content Visibility
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Who can see your posts</p>
                          <p className="text-sm text-muted-foreground">
                            Control the audience for your content
                          </p>
                        </div>
                        <Select defaultValue="followers">
                          <SelectTrigger className="w-40">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="public">
                              <div className="flex items-center gap-2">
                                <Globe className="h-4 w-4" />
                                <span>Public</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="followers">
                              <div className="flex items-center gap-2">
                                <UserPlus className="h-4 w-4" />
                                <span>Followers</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="private">
                              <div className="flex items-center gap-2">
                                <Lock className="h-4 w-4" />
                                <span>Only me</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Profile visibility</p>
                          <p className="text-sm text-muted-foreground">
                            Control who can find and view your profile
                          </p>
                        </div>
                        <Select defaultValue="public">
                          <SelectTrigger className="w-40">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="public">Public</SelectItem>
                            <SelectItem value="limited">Limited</SelectItem>
                            <SelectItem value="private">Private</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Messages & Tags</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Message requests</p>
                          <p className="text-sm text-muted-foreground">
                            Allow message requests from non-followers
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Tags</p>
                          <p className="text-sm text-muted-foreground">
                            Allow others to tag you in their posts
                          </p>
                        </div>
                        <Select defaultValue="everyone">
                          <SelectTrigger className="w-40">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="everyone">Everyone</SelectItem>
                            <SelectItem value="followers">
                              Followers only
                            </SelectItem>
                            <SelectItem value="nobody">Nobody</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button variant="outline">Cancel</Button>
                  <Button>Save Changes</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Manage how and when you receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      Push Notifications
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">New followers</p>
                          <p className="text-sm text-muted-foreground">
                            When someone follows your account
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Likes and comments</p>
                          <p className="text-sm text-muted-foreground">
                            When someone interacts with your posts
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Messages</p>
                          <p className="text-sm text-muted-foreground">
                            When you receive direct messages
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Mentions</p>
                          <p className="text-sm text-muted-foreground">
                            When someone mentions you in a post
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      Email Notifications
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Activity updates</p>
                          <p className="text-sm text-muted-foreground">
                            Weekly summary of activity on your account
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">News and updates</p>
                          <p className="text-sm text-muted-foreground">
                            Product updates and new features
                          </p>
                        </div>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Direct messages</p>
                          <p className="text-sm text-muted-foreground">
                            Email notifications for new messages
                          </p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      Notification Schedule
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Do Not Disturb</p>
                          <p className="text-sm text-muted-foreground">
                            Pause all notifications during specific hours
                          </p>
                        </div>
                        <Switch />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="dnd-start">Start Time</Label>
                          <Input
                            id="dnd-start"
                            type="time"
                            defaultValue="22:00"
                            disabled
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="dnd-end">End Time</Label>
                          <Input
                            id="dnd-end"
                            type="time"
                            defaultValue="07:00"
                            disabled
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button variant="outline">Cancel</Button>
                  <Button>Save Changes</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>
                    Manage your account security and access
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Password</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">
                          Current Password
                        </Label>
                        <Input id="current-password" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input id="new-password" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">
                          Confirm New Password
                        </Label>
                        <Input id="confirm-password" type="password" />
                      </div>
                      <Button className="mt-2">Update Password</Button>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      Two-Factor Authentication
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Enable 2FA</p>
                          <p className="text-sm text-muted-foreground">
                            Secure your account with two-factor authentication
                          </p>
                        </div>
                        <Switch />
                      </div>
                      <Button variant="outline" disabled>
                        Setup 2FA
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Login Sessions</h3>
                    <div className="space-y-4">
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="font-medium">Current Session</p>
                            <p className="text-sm text-muted-foreground">
                              San Francisco, CA - Chrome on MacOS
                            </p>
                          </div>
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            Active Now
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Started April 10, 2025 at 9:42 AM
                        </p>
                      </div>
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="font-medium">iPhone 14 Pro</p>
                            <p className="text-sm text-muted-foreground">
                              San Francisco, CA - SocialApp iOS
                            </p>
                          </div>
                          <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                            2 hours ago
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-xs text-muted-foreground">
                            Started April 8, 2025 at 7:15 PM
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 h-8"
                          >
                            Sign Out
                          </Button>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full">
                        Sign Out Of All Sessions
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="data" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Data & Privacy</CardTitle>
                  <CardDescription>
                    Manage your data and download information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Your Data</h3>
                    <div className="space-y-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-accent/20 rounded-lg">
                        <div>
                          <p className="font-medium">
                            Download Your Information
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Get a copy of your data, including posts, photos,
                            and account information
                          </p>
                        </div>
                        <Button className="md:self-start">
                          Request Download
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Data Preferences</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Personalized Ads</p>
                          <p className="text-sm text-muted-foreground">
                            Allow personalized ads based on your activity
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Data Collection</p>
                          <p className="text-sm text-muted-foreground">
                            Allow data collection to improve your experience
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Location Data</p>
                          <p className="text-sm text-muted-foreground">
                            Allow access to your location for relevant content
                          </p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      Account Management
                    </h3>
                    <div className="space-y-4">
                      <div className="flex flex-col gap-2">
                        <Button
                          variant="outline"
                          className="justify-start text-left h-auto py-3"
                        >
                          <div>
                            <p className="font-medium">
                              Deactivate Account Temporarily
                            </p>
                            <p className="text-sm text-muted-foreground font-normal">
                              Hide your profile and activity until you log back
                              in
                            </p>
                          </div>
                        </Button>
                        <Button
                          variant="outline"
                          className="justify-start text-left h-auto py-3 text-red-500 hover:text-red-600"
                        >
                          <div>
                            <p className="font-medium">
                              Delete Account Permanently
                            </p>
                            <p className="text-sm text-muted-foreground font-normal">
                              All your data will be permanently removed
                            </p>
                          </div>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
