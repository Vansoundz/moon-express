import { motion } from "framer-motion";
import React from "react";
import { useQuery } from "react-query";
import PropertyModel from "../../models/PropertyModel";
import { getProperties } from "../../services/propertyService";
import Loading from "../layout/Loading";
import Property from "./Property";
import "./property.css";

const Properties = () => {
  const { data: properties, isLoading } = useQuery(
    "get properties",
    getProperties
  );

  return (
    <>
      {isLoading && <Loading />}
      <motion.div className="container" style={{ margin: `16px` }}>
        {properties &&
          properties.map((property: PropertyModel, i: number) => (
            <Property key={i} property={property} />
          ))}
        {properties?.length === 0 && (
          <h3>ooops, we could not find any property now</h3>
        )}
      </motion.div>
    </>
  );
};

export default Properties;
