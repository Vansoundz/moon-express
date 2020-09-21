import React, { useContext, useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { authContext } from "../../contexts/authContext";
import User from "../../models/UserModel";
import { createComment, deleteComment } from "../../services/commentService";
import { getProperty, like } from "../../services/propertyService";
import Loading from "../layout/Loading";
import { Helmet } from "react-helmet";

const ViewProperty = () => {
  const { id } = useParams<{ id: string }>();
  const [comment, setComment] = useState("");
  const { data, isLoading, refetch } = useQuery(
    ["get single property", id],
    getProperty
  );
  const [addComment, { data: commentData }] = useMutation(createComment);
  const [deleteUserComment, { data: deleteData }] = useMutation(deleteComment);
  const [likeProperty, { data: likeData }] = useMutation(like);

  useEffect(() => {
    if (commentData && commentData.msg === "Success") {
      refetch();
    }
    if (deleteData && deleteData.msg === "Success") {
      refetch();
    }
    if (likeData && likeData.msg === "Success") {
      refetch();
    }
    // eslint-disable-next-line
  }, [commentData, deleteData, likeData]);

  const {
    auth: { user },
  } = useContext(authContext);

  return (
    <div style={{ margin: "16px" }}>
      <Helmet>
        <title>Moon: Property</title>
      </Helmet>
      {isLoading && <Loading />}

      {data?.property && (
        <div>
          <div className="property">
            <div>
              <div
                className="image"
                style={{
                  background: `url("${data?.property?.image}")`,
                }}
              >
                <div
                  style={{
                    padding: `8px`,
                    background: `#0000005f`,
                    color: `#fff`,
                    height: `40px`,
                  }}
                >
                  <span>
                    <span
                      className="material-icons"
                      onClick={async () => {
                        await likeProperty({ id: data.property._id });
                      }}
                    >
                      {data.property.likes.includes(user?._id)
                        ? "favorite"
                        : "favorite_border"}
                    </span>
                  </span>
                </div>
              </div>
            </div>
            <div className="pdetails">
              <div
                style={{
                  fontSize: `20px`,
                }}
              >
                {data.property.title}
              </div>
              <div
                style={{
                  fontSize: `14px`,
                  fontWeight: 300,
                  textAlign: "justify",
                }}
              >
                {data.property.description
                  ? `${data.property.description}`
                  : "Property description"}
              </div>
              <div style={{ display: "flex" }}>
                <span style={{ display: "flex" }}>
                  <span>{data.property.bedrooms}</span>
                  <div className="material-icons">hotel</div>
                </span>
                <span style={{ display: "flex", marginLeft: "16px" }}>
                  <span>{data.property.bathrooms}</span>
                  <div className="material-icons">bathtub</div>
                </span>
              </div>
              <div>Ksh {data.property.price}</div>
              <div>{data.property.location}</div>
            </div>
          </div>
        </div>
      )}

      <div
        style={{
          margin: `8px 0px 24px 0px`,
          maxWidth: "350px",
          padding: "16px",
        }}
      >
        <h4>Comments</h4>
        {data?.property?.comments && data?.property?.comments.length > 0 ? (
          <>
            {data?.property?.comments.map(
              (
                {
                  text,
                  user: { _id: id, username },
                  _id,
                }: {
                  text: string;
                  user: User;
                  date: string;
                  _id: string;
                },
                i: number
              ) => {
                return (
                  <div key={i}>
                    <h4>{username}</h4>

                    <div
                      style={{
                        fontSize: `14px`,
                        fontWeight: 300,
                        textAlign: "justify",
                      }}
                    >
                      {text}
                    </div>
                    {user?._id === id && (
                      <div
                        onClick={async () => {
                          await deleteUserComment({
                            property_id: data.property._id,
                            comment_id: _id!,
                          });
                          refetch();
                        }}
                        className="material-icons"
                        style={{ color: `red` }}
                      >
                        delete
                      </div>
                    )}
                  </div>
                );
              }
            )}
          </>
        ) : (
          <>
            <h5>No comments yet</h5>
          </>
        )}
      </div>

      {user ? (
        <div style={{ maxWidth: "350px", padding: "16px" }}>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (comment.trim()) {
                await addComment({ id, text: comment });
                // if (commentData && commentData.msg === " Success") {
                setComment("");
                // }
              }
              console.log(comment);
            }}
          >
            <div>
              <textarea
                value={comment}
                onChange={(e) => {
                  setComment(e.target.value);
                }}
                rows={3}
              ></textarea>
            </div>
            <div>
              <button>Comment</button>
            </div>
          </form>
        </div>
      ) : (
        <>
          <h4>Log in to leave a comment</h4>
        </>
      )}
    </div>
  );
};

export default ViewProperty;
