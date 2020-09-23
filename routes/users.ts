import { Request, response, Response, Router } from "express";
import {
  check,
  ValidationError,
  validationResult,
  body,
} from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "config";
import User from "../models/user";
import { auth } from "../middleware/auth";
import multer from "multer";
import Property from "../models/property";
// import { createTestAccount, createTransport } from "nodemailer";

import multerS3 from "multer-s3";
import { S3 } from "aws-sdk";
import { config as dotEnv } from "dotenv";

const router: Router = Router();

dotEnv();

var s3 = new S3({
  accessKeyId: process.env.AWSAccessKeyId,
  secretAccessKey: process.env.AWSSecretKey,
});

var upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "moonre-users",
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, `${Date.now()}${file.originalname}`);
    },
  }),
});

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     // @ts-ignore
//     const path = `./files/users/${req.user.id}/`;
//     mkdirSync(path, { recursive: true });
//     cb(null, path);
//   },
//   filename: function (req, file, cb) {
//     cb(null, `${Date.now()}${file.originalname}`);
//   },
// });

// const upload = multer({ storage: storage });

// const router: Router = Router();

router.get("/:id", async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    let user = await User.findById(id)
      .select("-password")
      .populate({
        path: "properties",
        model: Property,
        populate: {
          path: "user",
          model: User,
        },
      });
    if (!user) return res.json({ errors: [{ msg: "User not found" }] });
    res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ errors: [{ msg: "Server error" }] });
  }
});

router.get("/", auth, async (req: Request, res: Response) => {
  try {
    // let token = req.cookies.auth;
    // let token = req.headers["moon-auth"];
    // console.log(token);

    // if (!token) {
    //   return res.json({
    //     errors: [{ msg: "Invalid token" }],
    //   });
    // }

    // let auth = jwt.verify(token.toString(), config.get("jwtSecret"));

    // // @ts-ignore
    // if (!auth) {
    //   return res.json({
    //     errors: [{ msg: "Invalid token" }],
    //   });
    // }
    // @ts-ignore
    let user = await User.findById(req.user.id)
      .select("-password")
      .populate("properties");
    if (user) return res.status(200).json({ user });
    else return res.json({ errors: [{ msg: "Unauthorized" }] });
  } catch (err) {
    return res.json({
      errors: [
        {
          msg: "Error getting user",
        },
      ],
    });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const token: string = req.cookies.auth;
    if (!token || !token.trim()) {
      return res.json({
        msg: "Invalid token",
        status: 401,
      });
    }

    let usr = await jwt.decode(token, config.get("jwtSecret"));

    if (usr) {
      let user = await User.findById(usr.user.id).select("-password");
      if (user) {
        return res.status(200).json({
          msg: "user",
          user: user,
          status: 200,
        });
      }

      return res.json({
        msg: "Invalid token",
        status: 401,
        user: null,
      });
    }
    return res.json({
      msg: "invalid token",
      status: 401,
      user: null,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Server error",
      user: null,
    });
  }
});

router.post(
  "/register",
  [
    body("name").not().isEmpty().withMessage("Name is required"),
    check("username").not().isEmpty().withMessage("Username is required"),
    check("email").not().isEmpty().withMessage("Name is required"),
    check("email").isEmail().withMessage("Enter a valid email"),
    check("password")
      .isLength({ min: 6 })
      .withMessage("Email must be 6 or more characters"),
  ],
  async (req: Request, res: Response) => {
    try {
      let result = validationResult(req);
      let error: ValidationError[] = [];

      if (!result.isEmpty()) {
        return res.json({ errors: result.array() });
      }

      //
      let { name, username, email, password } = req.body;
      username = username.toLowerCase();

      let user = await User.findOne({ username });
      if (user) {
        error = [
          {
            msg: "Username already taken",
            param: "username",
            location: "params",
            value: "",
          },
        ];
        return res.json({ errors: error });
      } else {
        user = await User.findOne({ email });
      }

      if (user) {
        error = [
          {
            msg: "Email already taken",
            param: "email",
            location: "params",
            value: "",
          },
        ];
        return res.json({ errors: error });
      }

      // Create user
      user = new User({
        name,
        username,
        email,
        password,
      });

      // Generate password salt
      const salt = await bcrypt.genSalt(10);

      // @ts-ignore
      user.password = await bcrypt.hash(password, salt);

      await user.save();
      user = await User.findOne({ username }).select("-password");

      const payload = {
        user: {
          id: user?.id,
        },
      };
      await jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.cookie("auth", token, { maxAge: 1000 * 60 * 60 * 48 });
          return res.json({ token, user });
        }
      );
    } catch (error) {
      return res.status(500).send("Server error");
    }
  }
);

router.post(
  "/login",
  [
    check("username").not().isEmpty().withMessage("Username is required"),
    check("password").not().isEmpty().withMessage("Password is required"),
    check("password")
      .isLength({ min: 6 })
      .withMessage("Password must be 6 or more characters"),
  ],
  async (req: Request, res: Response) => {
    try {
      let result = validationResult(req);
      let error: ValidationError[] = [];

      if (!result.isEmpty()) {
        return res.json({ errors: result.array() });
      }
      let { username, password } = req.body;
      username = username.toLowerCase();

      var user = await User.findOne({ username });
      if (!user) {
        error = [
          {
            param: "username",
            msg: "User does not exist",
            location: "params",
            value: "",
          },
        ];
        return res.json({ errors: error });
      }
      // @ts-ignore
      let isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        error = [
          {
            param: "password",
            msg: "Invalid credentials",
            location: "params",
            value: "",
          },
        ];
        return res.json({ errors: error });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      user = await User.findOne({ username }).select("-password");

      await jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.cookie("auth", token, { maxAge: 1000 * 60 * 60 * 48 });
          res.status(200).json({ token, user });
        }
      );
    } catch (error) {
      return res.status(500).send("Server error");
    }
  }
);

router.patch(
  `/`,
  [auth, upload.single(`image`)],
  async (req: Request, res: Response) => {
    // @ts-ignore
    let id = req.user.id;

    try {
      let user = await User.findById(id);
      if (!user)
        return res.json({
          errrors: [
            {
              msg: "User not found",
            },
          ],
        });

      if (req.file) {
        // @ts-ignore
        user.image = req.file.location;
      }
      const { name, socialMedia } = req.body;

      // @ts-ignore
      if (name) user.name = name;
      if (socialMedia) {
        if (socialMedia?.facebook?.trim())
          // @ts-ignore
          user.socialMedia.facebook = socialMedia.facebook;
        if (socialMedia?.twitter?.trim())
          // @ts-ignore
          user.socialMedia.twitter = socialMedia.twitter;
        if (socialMedia?.instagram?.trim())
          // @ts-ignore
          user.socialMedia.instagram = socialMedia.instagram;
      }

      await user.save();

      return res.status(200).json({ user });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        errors: [{ msg: "Server error" }],
      });
    }
  }
);

router.post("/logout", async (req: Request, res: Response) => {
  try {
    res.cookie("auth", "", { maxAge: 1 });
    return res.status(200).json({ mmsg: "Success" });
  } catch (error) {
    return res.json({
      errors: [
        {
          msg: "Unknown error",
        },
      ],
    });
  }
});
export default router;
