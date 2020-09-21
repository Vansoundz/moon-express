import Axios from "axios";
import Property from "../models/PropertyModel";

const createProperty = async ({
  property,
}: {
  property: Property;
}): Promise<any> => {
  try {
    const form = new FormData();

    form.append("title", property.title!);

    // @ts-ignore
    form.append("price", property.price);
    // @ts-ignore
    form.append("bathrooms", property.bathrooms!);
    // @ts-ignore
    form.append("bedrooms", property.bedrooms!);
    form.append("image", property.file!);
    form.append("description", property.description!);
    form.append("location", property.location!);

    let resp = await Axios.post("/api/properties", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    // console.log(resp)
    return resp.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getProperties = async (): Promise<Property[]> => {
  try {
    let resp: Property[] = (await (await Axios.get(`/api/properties`))
      .data) as Property[];

    return resp;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const getProperty = async (key: string, id?: string) => {
  try {
    if (!id) return { errors: { msg: "Error getting property" } };

    let property = await (await Axios.get(`/api/properties/${id}`)).data;

    return property;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const like = async ({ id }: { id?: string }) => {
  try {
    if (!id) return null;
    let resp = await (await Axios.patch(`/api/properties/${id}/like`)).data;
    return resp;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const search = async ({ query }: { query: string }) => {
  if (query.length < 3) return [];
  try {
    let resp = await (
      await Axios.post(`/api/properties/search`, { search: query })
    ).data;
    if (resp.properties) return resp.properties.slice(0, 5);
    return [];
  } catch (error) {
    return [];
  }
};

const editProp = async ({ property }: { property: Property }) => {
  const form = new FormData();

  form.append("title", property.title!);

  // @ts-ignore
  form.append("price", property.price);
  // @ts-ignore
  form.append("bathrooms", property.bathrooms!);
  // @ts-ignore
  form.append("bedrooms", property.bedrooms!);
  if (property.file) {
    form.append("image", property.file!);
  }
  form.append("description", property.description!);
  form.append("location", property.location!);

  const resp = await (
    await Axios.patch(`/api/properties/${property._id}`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    })
  ).data;
  return resp;
};

export { createProperty, getProperties, getProperty, like, search, editProp };
