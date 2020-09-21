import React, { FC, useContext, useEffect } from "react";
import { useMutation, useQuery } from "react-query";
import { RefetchOptions } from "react-query/types/core/query";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { authContext } from "../../contexts/authContext";
import PropertyModel from "../../models/PropertyModel";
import { getProperties, like } from "../../services/propertyService";

interface IProps {
  property: PropertyModel;
  searchRefetch?: (
    options?: RefetchOptions | undefined
  ) => Promise<PropertyModel[] | undefined>;
  profileRefetch?: (
    options?: RefetchOptions | undefined
  ) => Promise<PropertyModel[] | undefined>;
  edit?: boolean;
}

const Property: FC<IProps> = ({
  property,
  searchRefetch,
  profileRefetch,
  edit = false,
}) => {
  const {
    title,
    location,
    description,
    image,
    price,
    _id,
    bathrooms,
    bedrooms,
    likes,
    user: usr,
  } = property;

  const {
    auth: { user },
  } = useContext(authContext);
  const [likeProperty, { data: likeData }] = useMutation(like);
  const { refetch } = useQuery("get properties", getProperties);

  useEffect(() => {
    if (likeData && likeData.msg === "Success") {
      // refetch();
      if (searchRefetch) searchRefetch();
      else if (profileRefetch) profileRefetch();
      else refetch();
    }

    // eslint-disable-next-line
  }, [likeData]);

  return (
    <div className="property">
      <div>
        <div
          className="image"
          style={{
            background: `url("${image}")`,
          }}
        >
          {user && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  padding: `8px`,
                  background: `#0000005f`,
                  color: `#fff`,
                  height: `40px`,
                }}
                onClick={async () => {
                  if (!user) {
                    return toast("Log in to like", { type: "warning" });
                  }
                  await likeProperty({ id: _id });
                }}
              >
                <span>
                  <span className="material-icons">
                    {likes?.includes(user._id || "")
                      ? "favorite"
                      : "favorite_border"}
                  </span>
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="pdetails">
        <div
          style={{
            fontSize: `20px`,
          }}
        >
          <Link to={`/property/${_id}`}> {title}</Link>
        </div>
        <div
          style={{
            fontSize: `14px`,
            fontWeight: 300,
            textAlign: "justify",
          }}
        >
          {description
            ? `${description?.substr(0, 100)}...`
            : "Property description"}
        </div>
        <div style={{ display: "flex" }}>
          <span style={{ display: "flex" }}>
            <span>{bedrooms}</span>
            <div
              style={{ color: `#666`, fontSize: "20px", marginLeft: "4px" }}
              className="material-icons"
            >
              hotel
            </div>
          </span>
          <span style={{ display: "flex", marginLeft: "16px" }}>
            <span>{bathrooms}</span>
            <div
              style={{ color: `#666`, fontSize: "20px", marginLeft: "4px" }}
              className="material-icons"
            >
              bathtub
            </div>
          </span>
        </div>
        <div>Ksh {price}</div>
        <div>{location}</div>
        {/* <div>
          <Link to={`/profile/${usr?._id}`}>{usr?.username}</Link>
        </div> */}
        <div>
          {edit && user && usr && user._id === usr._id && (
            <div
              style={{
                padding: `8px`,
              }}
            >
              <Link to={`/edit/property/${_id}`}>
                <div className="material-icons">edit</div>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Property;
