"use client";

import Post from "@/types/post";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useContext, useEffect, useState } from "react";
import LoadingDiv from "../util/loading";
import { GlobalAlertContext } from "@/context/global-alert";
import DownvoteButton from "../util/downvote-button";
import UpvoteButton from "../util/upvote-button";
import { deleteUserPost, downvotePost, upvotePost } from "@/lib/actions-client";
import Link from "next/link";
import PostControlContainer from "../containers/post-control-container";
import { useRouter } from "next/navigation";
import { useQueryClient } from "react-query";

interface Props {
  post: Post;
  onDelete: () => void;
}

function PostControl({ post, onDelete }: Props) {
  const user = useUser();

  const router = useRouter();

  const { showAlert } = useContext(GlobalAlertContext);

  const [isDeleting, setIsDeleting] = useState(false);

  const [postState, setPostState] = useState(post);

  //i want to render upvote and downvote in advance so that the user can see the change in score immediately

  const toggleUpvoteState = () => {
    if (postState.downvotes!.includes(user.user!.sub!)) {
      setPostState({
        ...postState,
        downvotes: postState.downvotes!.filter(
          (downvote) => downvote !== user.user!.sub!
        ),
        score: postState.score! + 1,
      });
    }

    if (postState.upvotes!.includes(user.user!.sub!)) {
      setPostState({
        ...postState,
        upvotes: postState.upvotes!.filter(
          (upvote) => upvote !== user.user!.sub!
        ),
        score: postState.score! - 1,
      });
    } else {
      setPostState({
        ...postState,
        upvotes: [...postState.upvotes!, user.user!.sub!],
        score: postState.score! + 1,
      });
    }
  };

  const toggleDownvoteState = () => {
    if (postState.upvotes!.includes(user.user!.sub!)) {
      setPostState({
        ...postState,
        upvotes: postState.upvotes!.filter(
          (upvote) => upvote !== user.user!.sub!
        ),
        score: postState.score! - 1,
      });
    }

    if (postState.downvotes!.includes(user.user!.sub!)) {
      setPostState({
        ...postState,
        downvotes: postState.downvotes!.filter(
          (downvote) => downvote !== user.user!.sub!
        ),
        score: postState.score! + 1,
      });
    } else {
      setPostState({
        ...postState,
        downvotes: [...postState.downvotes!, user.user!.sub!],
        score: postState.score! - 1,
      });
    }
  };

  const handleUpvote = async () => {
    toggleUpvoteState();

    try {
      const data = await upvotePost(post._id!);
      if (data) {
        setPostState(data);
        return;
      }

      showAlert("Error Upvoting Post");
    } catch (error: any) {
      showAlert(error.message);
    }
  };

  const handleDownvote = async () => {
    toggleDownvoteState();

    try {
      const data = await downvotePost(post._id!);
      if (data) {
        setPostState(data);
        return;
      }
      showAlert("Error Downvoting Post");
    } catch (error: any) {
      showAlert(error.message);
    }
  };

  const handleDelete = async () => {
    const data = await deleteUserPost(post._id!);

    if (data) {
      onDelete();
      showAlert("Post Deleted");
      return;
    }
    showAlert("Error Deleting Post");
  };

  useEffect(() => {
    setPostState(post);
  }, [post]);

  if (user.isLoading) {
    return <LoadingDiv />;
  }

  if (!user.user) {
    return (
      <div>
        <p className="text-sm text-center mt-3">
          You must be logged in to vote or comment.
        </p>
      </div>
    );
  }

  return (
    <PostControlContainer>
      {!isDeleting && (
        <div className="flex items-center justify-end gap-4">
          {user.user.sub === post.creatorId && (
            <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
              <button
                className="btn btn-sm text-xs"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsDeleting(true);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                  />
                </svg>
              </button>

              <button
                className="btn btn-sm text-xs"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  router.push(`/post/${post._id}/edit`);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                  />
                </svg>{" "}
              </button>
            </div>
          )}
          <div className="border border-base-200 flex items-center p-1 rounded-lg gap-2">
            <UpvoteButton
              onClick={handleUpvote}
              active={postState.upvotes!.includes(user.user.sub!)}
            />
            <span className=" text-sm">
              <b>{postState.score}</b>
            </span>
            <DownvoteButton
              onClick={handleDownvote}
              active={postState.downvotes!.includes(user.user.sub!)}
            />
          </div>
        </div>
      )}
      {isDeleting && (
        <div className="flex items-center justify-end gap-4 text-xs">
          <span>
            <b>Delete post?</b>{" "}
          </span>
          <button
            className="btn btn-sm text-xs"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsDeleting(false);
            }}
          >
            Cancel
          </button>
          <button
            className="btn btn-sm btn-outline btn-error text-xs"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleDelete();
            }}
          >
            Confirm
          </button>
        </div>
      )}
    </PostControlContainer>
  );
}

export default PostControl;