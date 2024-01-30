import { Link } from "@remix-run/react";

export default function NoteIndexPage() {
  return (
    <p>
      No growl selected. Select a growl on the left, or{" "}
      <Link to="new" className="text-blue-500 underline">
        create a new growl.
      </Link>
    </p>
  );
}
