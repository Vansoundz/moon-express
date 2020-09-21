import Property from "./PropertyModel";

interface User {
  email?: string;
  username?: string;
  _id?: string;
  password?: string;
  name?: string;
  image?: string;
  properties?: Property[];
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
}

type Auth = {
  user?: User | null;
  loading?: boolean;
};

export default User;
export type { Auth };
