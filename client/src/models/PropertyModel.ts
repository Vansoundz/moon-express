import User from "./UserModel";

interface Property {
  _id?: string;
  title?: string;
  price?: string | number;
  description?: string;
  file?: File;
  files?: File[];
  image?: string;
  images?: string[];
  likes?: string[];
  date?: Date;
  user?: User;
  location?: string;
  bedrooms?: string | number;
  bathrooms?: string | number;
  comments?: {
    user: User;
    text: string;
    date: string;
  }[];
}

export default Property;
