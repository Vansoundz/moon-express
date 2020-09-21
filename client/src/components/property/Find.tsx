import React, { FormEvent, useEffect, useState } from "react";
import { useMutation } from "react-query";
import { Link, useHistory } from "react-router-dom";
import Property from "../../models/PropertyModel";
import { search } from "../../services/propertyService";
import { Helmet } from "react-helmet";

const Find = () => {
  const [searchProperty, { data }] = useMutation(search);
  const [query, setQuery] = useState("");
  const [properties, setProperties] = useState<Property[]>([]);
  const h = useHistory();
  useEffect(() => {
    if (data) {
      setProperties(data);
    }
  }, [data]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      h.push(`/search?query=${query.trimEnd().split(/\s/).join("+")}`);
    }
  };
  return (
    <div className="find">
      <Helmet>
        <title>Moon:Search property or location</title>
      </Helmet>
      <div className="find-wrapper">
        <h4>Find your place</h4>
        <form onSubmit={onSubmit}>
          <div className="form-item">
            <span
              className="material-icons form-icon"
              style={{ marginTop: "8px" }}
              onClick={onSubmit}
            >
              search
            </span>
            <button
              className="srch-btn"
              style={{ cursor: `pointer`, boxShadow: "unset" }}
              onClick={onSubmit}
            >
              Search
            </button>
            <input
              type="search"
              onChange={(e) => {
                setQuery(e.target.value);
                if (e.target.value.length > 2) {
                  searchProperty({ query });
                } else setProperties([]);
              }}
            />
          </div>
        </form>

        <div>
          {properties && properties.length > 0 && (
            <div className="suggestions">
              {properties.map((property, i) => {
                return (
                  <div className="suggestion" key={i}>
                    <Link to={`/property/${property._id}`}>
                      {property.title}
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Find;
