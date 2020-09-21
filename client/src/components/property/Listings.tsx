import React from "react";
import { useQuery } from "react-query";
import { getProperties } from "../../services/propertyService";
import PropertyModel from "../../models/PropertyModel";
import Loading from "../layout/Loading";
import Listing from "./Listing";
import { Helmet } from "react-helmet";

const Listings = () => {
  const { data: properties, isLoading } = useQuery(
    "get properties",
    getProperties
  );

  return (
    <>
      <Helmet>
        <title>Moon:Property Listings</title>
      </Helmet>
      {isLoading && <Loading />}
      <div style={{ padding: `16px` }}>
        <h4>Listings</h4>
        <div className="listings">
          {properties &&
            properties.map((property: PropertyModel, i: number) => (
              <Listing property={property} key={i} />
            ))}
          {properties?.length === 0 && (
            <h3>ooops, we could not find any property now</h3>
          )}
        </div>
      </div>
    </>
  );
};

export default Listings;
