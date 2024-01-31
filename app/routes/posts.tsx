import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, NavLink, Outlet, useActionData, useLoaderData } from "@remix-run/react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart as faSolidHeart } from '@fortawesome/free-solid-svg-icons'
import { faHeart } from '@fortawesome/free-regular-svg-icons'


import { createPost, getPostListItems } from "~/models/post.server";
import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  const postListItems = await getPostListItems();
  return json({ postListItems });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const topic = formData.get("topic");
  const content = formData.get("content");

  if (typeof topic !== "string" || topic.length === 0) {
    return json(
      { errors: { content: null, topic: "Topic is required" } },
      { status: 400 },
    );
  }

  if (typeof content !== "string" || content.length === 0) {
    return json(
      { errors: { content: "Content is required", topic: null } },
      { status: 400 },
    );
  }

  const post = await createPost({ content, topic, userId });

  return redirect(`/posts/${post.id}`);
};

export default function PostsPage() {
  const data = useLoaderData<typeof loader>();
  const user = useUser();
  const actionData = useActionData<typeof action>();


  return (
    <div className="flex h-full min-h-screen flex-col">
      <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
        <h1 className="text-3xl font-bold">
          <Link to=".">Growler</Link>
        </h1>
        <p>{user.email}</p>
        <Form action="/logout" method="post">
          <button
            type="submit"
            className="rounded bg-slate-600 px-4 py-2 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
          >
            Logout
          </button>
        </Form>
      </header>

      <main className="flex h-full bg-white">
        <div className="h-full w-80 border-r bg-gray-50">
          <Link to="new" className="block p-4 text-xl text-blue-500">
            + New Growl
          </Link>

          <hr />

          {data.postListItems.length === 0 ? (
            <p className="p-4">No growls yet</p>
          ) : (
            <ol>
              {data.postListItems.map((post) => (
                <li key={post.id}>
                  <NavLink
                    className={({ isActive }) =>
                      `block border-b p-4 text-xl ${isActive ? "bg-white" : ""}`
                    }
                    to={String(post.id)}
                  >
                    <div className="flex flex-col justify-between">
                      <h2 className="font-bold">{post.topic}</h2>
                      <span className="text-sm text-gray-500">
                        {/*post.createdAt.toLocaleDateString()*/}
                      </span>
                      <div className="">{post.content}</div>
                    </div>
                    <div className="flex">
                      <button><FontAwesomeIcon icon={ faHeart } />{` ${ post.likes.length}` } </button> 
                    </div>
                  </NavLink>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="flex-1 p-6">
          <Outlet />
        </div>
        <div>
        <div className="block p-4 text-xl">
          Charts
          </div>
        </div>
      </main>
    </div>
  );
}
