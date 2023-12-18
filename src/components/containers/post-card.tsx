import UpvoteIcon from "@/app/assets/upvote-icon";
import NormalContainer from "./normal-container";
import DownvoteButton from "@/app/assets/downvote-icon";
import style from "./post-card.module.css";
import _ from "lodash";

interface PostCardProps {
  onClick: () => void;
  title: string;
  displayName: string;
  body: string;
  upvotes: number;
  createdAt: string;
}

function PostCard({
  title,
  displayName,
  body,
  upvotes,
  createdAt,
  onClick,
}: PostCardProps) {
  return (
    <NormalContainer className="hover:border-primary max-w-md">
      <div className="prose" onClick={onClick}>
        <div className="font-semibold opacity-80 text-xs">
          Posted by: {displayName}
        </div>
        <h3 className="mb-0 mt-2">{title}</h3>

        <div className="font-semibold opacity-80 text-xs">{createdAt}</div>

        <p
          className={
            " overflow overflow-y-hidden text-sm " + style.fadeOutBottom
          }
          style={{ maxHeight: "120px" }}
        >
          {body}
        </p>
      </div>

      <div className="flex items-center justify-start gap-2 mt-3">
        <button className="btn btn-outline btn-success btn-sm">
          <UpvoteIcon />
        </button>
        <span className=" text-lg">
          <b>{upvotes}</b>
        </span>
        <button className="btn btn-outline btn-error btn-sm">
          <DownvoteButton />
        </button>
      </div>
    </NormalContainer>
  );
}

export default PostCard;