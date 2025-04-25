import UserProfile from "@/components/user/UserProfile";

interface UserProfilePageProps {
  params: Promise<{
    username: string;
  }>;
}

export default async function UserProfilePage({
  params,
}: UserProfilePageProps) {
  const { username } = await params;

  return <UserProfile username={username} />;
}
