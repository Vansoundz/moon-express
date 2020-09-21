import { AnimatePresence, motion } from "framer-motion";
import React, { FormEvent, useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import Property from "../../models/PropertyModel";
import { editProp, getProperty } from "../../services/propertyService";
import Loading from "../layout/Loading";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";

const EditProperty = () => {
  const tfeed = document.querySelector(".error.title");
  const pfeed = document.querySelector(".error.price");
  const dfeed = document.querySelector(".error.description");
  const lfeed = document.querySelector(".error.location");
  const ffeed = document.querySelector(".error.file");
  const bdfeed = document.querySelector(".error.bedrooms");
  const btfeed = document.querySelector(".error.bathrooms");

  const resetFields = () => {
    setTimeout(() => {
      if (tfeed) tfeed.textContent = "";
      if (dfeed) dfeed.textContent = "";
      if (pfeed) pfeed.textContent = "";
      if (lfeed) lfeed.textContent = "";
      if (ffeed) ffeed.textContent = "";
      if (bdfeed) bdfeed.textContent = "";
      if (btfeed) btfeed.textContent = "";
    }, 4000);
  };

  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property>({});
  const { data, isLoading } = useQuery(
    ["get single property", id],
    getProperty
  );

  const [editProperty, { data: edit, isLoading: loading }] = useMutation(
    editProp
  );

  useEffect(() => {
    if (data && data.property) setProperty(data.property);
  }, [data]);

  useEffect(() => {
    if (edit && edit.property) {
      console.log(edit.property);
      toast("Property edited", { type: "success" });
    }
  }, [edit]);

  const variants = {
    initial: { height: 0 },
    animate: { height: `100%` },
    exit: { height: 0 },
  };

  const onChange = (e: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProperty({
      ...property,
      [e.currentTarget.id]: e.currentTarget.value,
    });
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const {
      title,
      price,
      description,

      location,
      bathrooms,
      bedrooms,
    } = property;

    if (!title) {
      tfeed!.textContent = "Title is required";
    } else if (!price) {
      pfeed!.textContent = "Price is required";
    } else if (!description) {
      dfeed!.textContent = "Description is required";
    } else if (!location) {
      lfeed!.textContent = "Location is required";
    } else if (!bathrooms) {
      btfeed!.textContent = "Bathrooms is required";
    } else if (!bedrooms) {
      bdfeed!.textContent = "Bedrooms is required";
    } else {
      // uole.log(property);

      await editProperty({ property });
      // setProperty({
      //   title: "",
      //   description: "",
      //   price: 0,
      //   image: undefined,
      // });
    }
    resetFields();
  };

  return (
    <div>
      <Helmet>
        <title>Moon:Edit Profile</title>
      </Helmet>
      {(isLoading || loading) && <Loading />}
      <div className="center">
        <form onSubmit={onSubmit}>
          <div className="row" style={{ display: "flex" }}>
            <div className="col s12 m8 l6" style={{ margin: "auto" }}>
              <h4>Create property</h4>
              <div>
                <div className="form-item">
                  {/* <span className="form-icon material-icons">person</span> */}
                  <input
                    className="pl8"
                    type="text"
                    placeholder="Title"
                    onChange={onChange}
                    id="title"
                    value={property.title || ""}
                  />
                  <AnimatePresence>
                    <motion.div
                      variants={variants}
                      className="error title"
                    ></motion.div>
                  </AnimatePresence>
                </div>
              </div>
              <div>
                <div className="form-item">
                  {/* <span className="form-icon material-icons">person</span> */}
                  <input
                    className="pl8"
                    type="number"
                    placeholder="Price"
                    onChange={onChange}
                    id="price"
                    value={property.price || ""}
                  />{" "}
                  <AnimatePresence>
                    <motion.div
                      variants={variants}
                      className="error price"
                    ></motion.div>
                  </AnimatePresence>
                </div>
              </div>
              <div>
                <div className="form-item">
                  {/* <span className="form-icon material-icons">person</span> */}
                  <input
                    className="pl8"
                    type="text"
                    placeholder="Location"
                    onChange={onChange}
                    id="location"
                    value={property.location || ""}
                  />{" "}
                  <AnimatePresence>
                    <motion.div
                      variants={variants}
                      className="error location"
                    ></motion.div>
                  </AnimatePresence>
                </div>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gridColumnGap: "8px",
                }}
              >
                <div className="form-item">
                  {/* <span className="form-icon material-icons">person</span> */}
                  <input
                    className="pl8"
                    type="number"
                    placeholder="Bedrooms"
                    onChange={onChange}
                    id="bedrooms"
                    value={property.bedrooms || ""}
                  />{" "}
                  <AnimatePresence>
                    <motion.div
                      variants={variants}
                      className="error bedrooms"
                    ></motion.div>
                  </AnimatePresence>
                </div>
                <div className="form-item">
                  {/* <span className="form-icon material-icons">person</span> */}
                  <input
                    className="pl8"
                    type="number"
                    placeholder="Bathrooms"
                    onChange={onChange}
                    id="bathrooms"
                    value={property.bathrooms || ""}
                  />{" "}
                  <AnimatePresence>
                    <motion.div
                      variants={variants}
                      className="error bathrooms"
                    ></motion.div>
                  </AnimatePresence>
                </div>
              </div>
              <div>
                <div className="form-item">
                  {/* <span className="form-icon material-icons">person</span> */}
                  <textarea
                    placeholder="Description"
                    onChange={onChange}
                    id="description"
                    rows={3}
                    value={property.description || ""}
                  ></textarea>
                  <AnimatePresence>
                    <motion.div
                      variants={variants}
                      className="error description"
                    ></motion.div>
                  </AnimatePresence>
                </div>
              </div>

              <div className="file-field ">
                {property.file ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <div style={{ fontSize: `12px` }}>
                      Selected file:
                      <span>{property.file.name}</span>
                    </div>
                    <div
                      onClick={() =>
                        setProperty({ ...property, file: undefined })
                      }
                      className="material-icons"
                    >
                      close
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="">
                      <label style={{ cursor: "pointer" }} htmlFor="file">
                        Select file
                      </label>
                      <input
                        type="file"
                        id="file"
                        name="files"
                        hidden={true}
                        multiple
                        onChange={(e) => {
                          const files = e.target.files;

                          if (files) {
                            setProperty({
                              ...property,
                              file: files[0],
                            });
                          }
                        }}
                      />
                    </div>
                  </>
                )}
                <AnimatePresence>
                  <motion.div
                    variants={variants}
                    className="error file"
                  ></motion.div>
                </AnimatePresence>
              </div>

              <button
                style={{ marginTop: "10px" }}
                type="submit"
                className="btn "
              >
                Edit Property
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProperty;
