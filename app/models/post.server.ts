
import { prisma } from "~/db.server";

type Post = {
  id: number;
  topic: string;
  content: string;
  userId: number;
  likes: number;
};

type Like = {
  id: number;
  userId: number; 
  postId: number;  
};

type User = {
  id: string;
  email: string;
  username: string;
  password:  string;
  posts: Post[];
  likes: Like[]; 
};


export function getPost({
  id,
  userId,
}: Pick<Post, "id"> & {
  userId: User["id"];
}) {
  return prisma.post.findFirst({
    select: { id: true, content: true, topic: true },
    where: { id, userId },
  });
}

export function getPostListItems({ userId }: { userId: User["id"] }) {
  return prisma.post.findMany({
    where: { userId },
    select: { id: true, content: true, topic: true },
    orderBy: { updatedAt: "desc" },
  });
}

export function createPost({
  content,
  topic,
  userId,
}: Pick<Post, "content" | "topic"> & {
  userId: User["id"];
}) {
  return prisma.post.create({
    data: {
      topic,
      content,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export function deletePost({
  id,
  userId,
}: Pick<Post, "id"> & { userId: User["id"] }) {
  return prisma.post.deleteMany({
    where: { id, userId },
  });
}
