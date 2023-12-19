"use client";
import Post from "@/types/post";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useState } from "react";

function PostButton() {
  const user = useUser();

  const [postContent, setPostContent] = useState<Post>({
    title: "",
    creatorName: "",
    body: "",
    upvotes: 0,
    displayName: "",
    createdAt: "",
  });

  const closeModal = () => {
    const modal: any = document.getElementById("modal-post");
    modal.close();
  };

  const openModal = () => {
    const modal: any = document.getElementById("modal-post");
    modal.showModal();
  };

  return (
    <div className="w-full">
      <button
        className="p-3 rounded-badge overflow-hidden overflow-ellipsis text-left font-semibold text-sm sm:text-md w-full bg-base-200 hover:bg-base-300 border hover:border-accent"
        onClick={openModal}
        contentEditable={false}
      >
        What&apos;s on your mind, {user.user?.name?.split(" ")[0]}?
      </button>
      <dialog id="modal-post" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">What&apos;s on your mind?</h3>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Title</span>
              <span className="label-text">0/40</span>
            </div>
            <input
              type="text"
              placeholder="Enter Title"
              className="input input-bordered w-full"
            />
          </label>

          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Body</span>
              <span className="label-text">0/300</span>
            </div>
            <textarea
              placeholder="Enter Body"
              className="textarea textarea-bordered textarea-sm w-full"
              style={{ minHeight: "200px" }}
            />
          </label>
          <div className="modal-action">
            <button className="btn btn-accent">Post</button>
            <button className="btn" onClick={closeModal}>
              Cancel
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}

export default PostButton;
