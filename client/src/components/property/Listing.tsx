import React, { FC, useContext, useEffect } from "react";
import { useMutation, useQuery } from "react-query";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { authContext } from "../../contexts/authContext";
import Property from "../../models/PropertyModel";
import { getProperties, like } from "../../services/propertyService";

interface IProp {
  property: Property;
}

const Listing: FC<IProp> = ({ property }) => {
  const {
    image,
    _id,
    title,
    price,
    bathrooms,
    likes,
    bedrooms,
    location,
  } = property;
  const [likeProperty, { data: likeData }] = useMutation(like);
  const { refetch } = useQuery("get properties", getProperties);

  useEffect(() => {
    if (likeData && likeData.msg === "Success") {
      refetch();
    }
    // eslint-disable-next-line
  }, [likeData]);

  const {
    auth: { user },
  } = useContext(authContext);

  return (
    <div>
      <div className="listing">
        <div>
          <div
            className="l-image"
            style={{
              background: `url("${image}")`,
            }}
          >
            {user && (
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
            )}
          </div>
        </div>
        <div className="l-body">
          <div className="lb-title">
            <Link to={`/property/${_id}`}>{title}</Link>
          </div>
          <div className="lb-title">{location}</div>
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
          <div className="lb-title">Ksh {price}</div>
        </div>
      </div>
    </div>
  );
};

export default Listing;
