import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as faSolidHeart } from '@fortawesome/free-solid-svg-icons'
import { faHeart } from '@fortawesome/free-regular-svg-icons'
import { faShare } from '@fortawesome/free-solid-svg-icons'
import { faComment } from '@fortawesome/free-regular-svg-icons'

import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import invariant from "tiny-invariant";

import { createLike, deleteLikes, deletePost, getPost, getPostWithLikers } from "~/models/post.server";
import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  invariant(params.postId, "postId not found");

  const post = await getPostWithLikers({ id: Number(params.postId) });
  if (!post) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ post });
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);
  invariant(params.postId, "postId not found");

  const formData = await request.formData();
  const actionType = formData.get("_action");

  console.log(`actionType: ${actionType}`)

  switch (actionType) {
    case "DELETE": {
      let result = await deletePost({ id: Number(params.postId), userId });
      console.log(result);
      return redirect("/posts");
    }
    case "LIKE": {
      let result = await createLike({ postId: Number(params.postId), userId });
      console.log(result);
      break;
    }
    case "UNLIKE": {
      let result = await deleteLikes({ postId: Number(params.postId), userId });
      console.log(result);
      break;
    }
    case "REPOST": {
      break;
    }
    case "REPLY": {
      break;
    }
  }
  //return redirect(`/posts/${params.postId}`);
  return null;
};

export default function PostDetailsPage() {
  console.log('PostDetailsPage');
  const data = useLoaderData<typeof loader>();
  const user = useUser();
  const post = data.post;

  const liked = post.likes.some(like => like.userId === user.id);

  //console.log(`user: ${user.id} post owner: ${data.post.userId} show delete: ${data.post.userId === user.id}, liked: ${liked}`);
  return (
    <div>
      <h3 className="text-2xl font-bold">{data.post.topic}</h3>
      <span className="text-sm text-gray-500">
        {`${post.user.username} at ${post.createdAt}`} 
      </span>
      <p className="py-6">{data.post.content}</p>
      <hr className="my-4" />
      <Form method="post">
        <div className="flex gap-4">
          {
            data.post.user.id === user.id ?
              <button
                type="submit"
                name="_action"
                value="DELETE"
                className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
              >
                Delete
              </button>
              :
              <>
                {
                  liked ?
                    (<button type="submit" name="_action" value="UNLIKE" title="Unlike">
                      <FontAwesomeIcon icon={faSolidHeart} />{` ${post.likes.length} likes`}
                    </button>) :
                    (<button type="submit" name="_action" value="LIKE"  title="Like">
                      <FontAwesomeIcon icon={faHeart} />{` ${post.likes.length} likes`}
                    </button>)
                }
                <button type="submit" name="_action" value="REPOST">
                  <FontAwesomeIcon icon={faShare} /> Regrowl
                </button>
                <button type="submit" name="_action" value="REPLY">
                  <FontAwesomeIcon icon={faComment} /> Reply
                </button>
              </>
          }
        </div>
      </Form>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (error instanceof Error) {
    return <div>An unexpected error occurred: {error.message}</div>;
  }

  if (!isRouteErrorResponse(error)) {
    return <h1>Unknown Error</h1>;
  }

  if (error.status === 404) {
    return <div>Post not found</div>;
  }

  return <div>An unexpected error occurred: {error.statusText}</div>;
}
