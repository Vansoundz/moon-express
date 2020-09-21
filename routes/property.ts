import { Request, Response, Router } from "express";
import mongoose from "mongoose";
import Property from "../models/property";
import { auth } from "../middleware/auth";
import { body, ValidationError, validationResult } from "express-validator";
import multer from "multer";
import User from "../models/user";
import Comment from "../models/comment";
// import { mkdirSync } from "fs";
import multerS3 from "multer-s3";
import aws, { S3 } from "aws-sdk";
import { config } from "dotenv";

const router: Router = Router();

config();

var s3 = new S3({
  accessKeyId: process.env.AWSAccessKeyId,
  secretAccessKey: process.env.AWSSecretKey,
});

var upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "moonre",
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
//     const path = `./files/properties/${req.user.id}`;
//     mkdirSync(path, { recursive: true });
//     cb(null, path);
//   },
//   filename: function (req, file, cb) {
//     cb(null, `${Date.now()}${file.originalname}`);
//   },
// });

// const upload = multer({ storage: storage });
// const singleUpload = upload.single("image");

const handleErrors = (req: Request): ValidationError[] => {
  const { title, price, description, location, bathrooms, bedrooms } = req.body;
  let errors: ValidationError[] = [];

  if (!title || !title.trim()) {
    errors = [
      ...errors,
      {
        msg: "Title is required",
        param: "title",
        location: "body",
        value: title,
      },
    ];
  }

  if (!bedrooms || !bedrooms.trim()) {
    errors = [
      ...errors,
      {
        msg: "Bedrooms is required",
        param: "bedrooms",
        location: "body",
        value: title,
      },
    ];
  }

  if (!bathrooms || !bathrooms.trim()) {
    errors = [
      ...errors,
      {
        msg: "Bathrooms is required",
        param: "bathrooms",
        location: "body",
        value: title,
      },
    ];
  }

  if (!description || !description.trim()) {
    errors = [
      ...errors,
      {
        msg: "Description is required",
        param: "description",
        location: "body",
        value: title,
      },
    ];
  }

  if (!location || !location.trim()) {
    errors = [
      ...errors,
      {
        msg: "Location is required",
        param: "location",
        location: "body",
        value: title,
      },
    ];
  }

  if (!price || !price.trim()) {
    errors = [
      ...errors,
      {
        msg: "Price is required",
        param: "price",
        location: "body",
        value: price,
      },
    ];
  }

  return errors;
};

router.get("/", async (req: Request, res: Response) => {
  try {
    let properties = await Property.find({}).populate("user", [
      "username",
      "email",
    ]);
    if (properties) {
      res.json(properties);
    } else {
      res.json([]);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
});

router.post(
  `/search`,
  [body("search").notEmpty().withMessage("Please specify what you want")],
  async (req: Request, res: Response) => {
    const result = validationResult(req);

    if (!result.isEmpty())
      return res.status(400).json({ errors: result.array() });
    try {
      const { search } = req.body;
      let sArr: RegExp[] = search
        .split(" ")
        .map((s: string) => new RegExp(s, "i"));

      let properties = await Property.find({
        // title: `/${search.split(" ")[0]}/`,

        // title: { $regex: `/${search}/i` },
        $or: [
          { title: { $in: sArr } },
          { location: { $in: sArr } },
          { "user.username": { $in: sArr } },
        ],
      }).populate("user", ["username", "email"]);

      if (!properties)
        return res.status(404).json({ msg: "No items were found" });

      return res.status(200).json({ properties });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        errors: [{ msg: "Server error, try again" }],
      });
    }
  }
);

router.get("/:id", async (req: Request, res: Response) => {
  let id = req.params.id;

  try {
    let property = await Property.findById(id)
      .populate("user", ["username", "email"])
      .populate({
        path: "comments",
        model: Comment,
        populate: {
          path: "user",
          model: User,
          select: "-password",
        },
      });
    if (!property) {
      return res.status(404).json({
        msg: "item not found",
        param: "item",
      });
    } else {
      return res.status(200).json({
        property,
      });
    }
  } catch (error) {
    return res.status(500).json({
      msg: "Server error",
    });
  }
});

router.post(
  "/",

  [auth, upload.single("image")],
  // body("title").notEmpty().withMessage("Title is required"),
  // body("price").notEmpty().withMessage("Price is required"),

  async (req: Request, res: Response) => {
    const {
      title,
      price,
      description,
      location,
      bathrooms,
      bedrooms,
    } = req.body;

    try {
      let errors: ValidationError[] = handleErrors(req);
      // let errors = validationResult(req);

      if (errors.length > 0) {
        return res.json({ errors });
      }
      if (!req.file) {
        return res.status(400).json([
          {
            msg: "File error",
            param: "image",
          },
        ]);
      }

      let property = new Property({
        title,
        price,
        description,
        location,
        bedrooms,
        bathrooms,
        // @ts-ignore
        image: req.file.location,
      });

      // @ts-ignore
      let user = await User.findById(req.user.id);
      if (!user)
        return res.status(401).json({
          errors: [
            {
              msg: "Unauthorized access",
            },
          ],
        });

      // @ts-ignore
      user.properties = [...user.properties, property._id];
      await user.save();

      // @ts-ignore
      property.user = mongoose.Types.ObjectId(req.user.id);
      await property.save();
      return res.status(200).json({ property });
    } catch (error) {
      console.log(error.message);
      return res.status(500).send("Server error");
    }
  }
);

router.patch(
  "/:id",
  [auth, upload.single("image")],
  async (req: Request, res: Response) => {
    let errors: ValidationError[] = handleErrors(req);
    // let errors = validationResult(req);

    if (errors.length > 0) {
      return res.json({ errors });
    }

    try {
      let id = req.params.id;

      let property = await Property.findById(id);

      if (!property)
        return res.status(404).json({
          errors: [
            {
              msg: "Property not found",
            },
          ],
        });

      // @ts-ignore
      if (!mongoose.Types.ObjectId(req.user.id).equals(property.user)) {
        return res.status(401).json({
          msg: "Unauthorized action",
        });
      }

      const { title, description, price, bedrooms, bathrooms } = req.body;
      if (req.file) {
        // @ts-ignore
        property.image = req.file.filename;
      }

      // @ts-ignore
      property.title = title;
      // @ts-ignore
      property.description = description;
      // @ts-ignore
      property.price = price;
      // @ts-ignore
      property.bedrooms = bedrooms;
      // @ts-ignore
      property.bathrooms = bathrooms;

      await property.save();

      // await property?.updateOne({ title, price, description });
      res.status(200).json({
        property,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send("Server error");
    }
  }
);

router.delete("/:id", [auth], async (req: Request, res: Response) => {
  try {
    let id = req.params.id;
    let property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({
        msg: "Item not found",
      });
    }
    // @ts-ignore
    if (mongoose.Types.ObjectId(req.user.id).equals(property.user)) {
      await property.remove();
      return res.status(200).json({
        msg: "Property deleted successfuly",
      });
    }
    res.status(401).json({
      msg: "Unauthorized action",
    });
  } catch (error) {
    return res.status(500).json({
      msg: "server error",
    });
  }
});

//Like property
router.patch("/:pid/like", auth, async (req: Request, res: Response) => {
  try {
    let id = req.params.pid;
    let property = await Property.findById(id);

    if (!property) {
      return res.status(404).json({ msg: "Item not found" });
    }

    // @ts-ignore
    let uid = mongoose.Types.ObjectId(req.user.id);

    // @ts-ignore
    if (!property.likes.includes(uid)) {
      // @ts-ignore
      property.likes = [...property.likes, uid];
    } else {
      // @ts-ignore
      property.likes = property.likes.filter((like) => !uid.equals(like));
    }

    await property.save();

    return res.status(200).json({
      msg: "Success",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "server error",
    });
  }
});

//comment on property
router.patch(
  "/:pid/comment",
  [
    auth,
    body("text").not().isEmpty().withMessage("Actual comment is required"),
  ],
  async (req: Request, res: Response) => {
    try {
      let errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.json(errors.array());
      }

      let id = req.params.pid;
      let property = await Property.findById(id);

      if (!property) {
        return res.status(404).json({ msg: "Item not found" });
      }
      // @ts-ignore
      let uid = mongoose.Types.ObjectId(req.user.id);
      let comment = {};
      // @ts-ignore
      (comment.user = mongoose.Types.ObjectId(uid)),
        // @ts-ignore
        (comment.text = req.body.text),
        // @ts-ignore
        (property.comments = [...property.comments, comment]);

      await property.save();

      return res.status(200).json({
        msg: "Success",
      });
    } catch (error) {
      return res.status(500).json({
        msg: "server error",
      });
    }
  }
);

//delete comment on property
router.delete("/:pid/:cid", [auth], async (req: Request, res: Response) => {
  try {
    let pid = req.params.pid;

    let property = await Property.findById(pid);

    if (!property) {
      return res.status(404).json({ msg: "Item not found" });
    }
    // let uid = mongoose.Types.ObjectId(req.user.id);
    let cid = mongoose.Types.ObjectId(req.params.cid);

    // if(uid.equals())
    if (property) {
      // @ts-ignore
      property.comments = property.comments.filter(
        // @ts-ignore
        (comment) => !cid.equals(comment.id)
      );
    }

    await property.save();

    return res.status(200).json({
      msg: "Success",
    });
  } catch (error) {
    return res.status(500).json({
      msg: "server error",
    });
  }
});

export default router;
