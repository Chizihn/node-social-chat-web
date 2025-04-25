import PostDetail from "@/components/feed/PostDetail";

interface PostDetailsTypeProps {
  params: Promise<{
    postId: string;
  }>;
}

export default async function PostDetailsType({
  params,
}: PostDetailsTypeProps) {
  const { postId } = await params;

  return <PostDetail postId={postId} />;
}
