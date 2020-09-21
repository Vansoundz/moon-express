import React from "react";
import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import { search } from "../../services/propertyService";
import Loading from "../layout/Loading";
import Property from "./Property";
import PropertyModel from "../../models/PropertyModel";
import { Helmet } from "react-helmet";

const SearchPage = () => {
  const location = useLocation();
  let query = location.search.split("=")[1].split("+").join(" ");

  const searchProp = async (
    key: string,
    q: string
  ): Promise<PropertyModel[]> => {
    return await search({ query: q });
  };

  const { data, isLoading, refetch } = useQuery(["Search", query], searchProp);

  return (
    <div>
      <Helmet>
        <title>Moon:Search result</title>
      </Helmet>
      {isLoading && <Loading />}
      <div
        style={{
          margin: "16px",
        }}
        id="search-page"
      >
        <h4>Search results</h4>

        {data && (
          <div>
            {data.length > 0 ? (
              <>
                {data.map((property, i) => (
                  <Property
                    key={i}
                    property={property}
                    searchRefetch={refetch}
                  />
                ))}
              </>
            ) : (
              <>
                <h4>Oops, we could find any property, try another term</h4>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
