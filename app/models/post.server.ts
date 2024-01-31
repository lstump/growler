
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
  id
}: Pick<Post, "id">) {
  return prisma.post.findFirst({
    select: { id: true, content: true, topic: true, userId: true, likes: true},
    where: { id },
  });
}

export function getPostListItems() {
  return prisma.post.findMany({
    where: {  },
    select: { id: true, content: true, topic: true, likes: true },
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

export function createLike({
  userId,
  postId
  }: Pick<Like, "userId" & "postId"> & { userId: User["id"]; postId: Post["id"]; }) {  
  return prisma.like.create({  
    data: {  
      user: {  
        connect: {  
          id: userId  
        }  
      },  
      post: {  
        connect: {  
          id: postId  
        }  
      }  
    }  
  });  
}

export function deleteLikes({
  postId,
  userId,
}: Pick<Like, "postId"> & { userId: User["id"] }) {
  return prisma.like.deleteMany({
    where: { postId, userId },
  });
}

export function getPostWithLikers({
  id
}: Pick<Post, "id">) {  
  return prisma.post.findUnique({  
    where: { id: id },  
    include: { likes: { include: { user: true } } }  
  });
}  
