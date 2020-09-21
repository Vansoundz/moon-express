import React, {
  useContext,
  useEffect,
  useState /** , { useContext } */,
} from "react";
import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import { getUserById } from "../../services/authService";
import { authContext } from "../../contexts/authContext";
import User from "../../models/UserModel";
import Loading from "../layout/Loading";
import Property from "../property/Property";
import "./profile.css";
import { Helmet } from "react-helmet";

const Profile = () => {
  const { id } = useParams<{ id: string }>();
  const [userProfile, setUserProfile] = useState<User>();
  const { data: usr, isLoading, refetch } = useQuery(
    ["get user profile", id],
    getUserById
  );
  const {
    auth: { user },
  } = useContext(authContext);
  useEffect(() => {
    if (usr && usr.user) setUserProfile(usr.user);
  }, [usr]);
  return (
    <div className="profile">
      <Helmet>
        <title>Moon:User Profile</title>
      </Helmet>
      {isLoading && <Loading />}
      {userProfile && (
        <div>
          <div className="profile-head">
            <div>
              {usr.user && (
                <div
                  className="image"
                  style={{
                    background: `url("${userProfile.image}")`,
                    borderRadius: `50%`,
                    marginRight: `unset`,
                  }}
                ></div>
              )}
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ marginTop: "16px" }}>
                <h3>{userProfile.name}</h3>
              </div>
              <div>{userProfile.email}</div>
              <div>
                {userProfile._id === user?._id && (
                  <Link to={`/edit/profile`}>Edit profile</Link>
                )}
              </div>
            </div>
          </div>
          <div className="user-listings">
            <div>
              <h3>Listings</h3>
            </div>
            <div>
              {userProfile &&
              userProfile.properties &&
              userProfile?.properties?.length > 0 ? (
                userProfile.properties.map((property, i) => (
                  <Property
                    key={i}
                    property={property}
                    profileRefetch={refetch}
                    edit={true}
                  />
                ))
              ) : (
                <h6>
                  {userProfile._id === user?._id
                    ? "You have "
                    : `${userProfile.name} has `}{" "}
                  not listed any property
                </h6>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
