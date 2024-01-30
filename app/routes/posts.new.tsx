import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { useEffect, useRef } from "react";

import { createPost } from "~/models/post.server";
import { requireUserId } from "~/session.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  debugger;
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

export default function NewPostPage() {
  const actionData = useActionData<typeof action>();
  const topicRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (actionData?.errors?.topic) {
      topicRef.current?.focus();
    } else if (actionData?.errors?.content) {
      contentRef.current?.focus();
    }
  }, [actionData]);

  return (
    <Form
      method="post"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%",
      }}
    >
      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Topic: </span>
          <input
            ref={topicRef}
            name="topic"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            aria-invalid={actionData?.errors?.topic ? true : undefined}
            aria-errormessage={
              actionData?.errors?.topic ? "topic-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.topic ? (
          <div className="pt-1 text-red-700" id="topic-error">
            {actionData.errors.topic}
          </div>
        ) : null}
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Content: </span>
          <textarea
            ref={contentRef}
            name="content"
            rows={8}
            className="w-full flex-1 rounded-md border-2 border-blue-500 px-3 py-2 text-lg leading-6"
            aria-invalid={actionData?.errors?.content ? true : undefined}
            aria-errormessage={
              actionData?.errors?.content ? "content-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.content ? (
          <div className="pt-1 text-red-700" id="content-error">
            {actionData.errors.content}
          </div>
        ) : null}
      </div>

      <div className="text-right">
        <button
          type="submit"
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Save
        </button>
      </div>
    </Form>
  );
}
