import { Request, Response, Router } from "express";
import { check, validationResult } from "express-validator";
import { auth } from "../middleware/auth";
import Property from "../models/property";
import Comment from "../models/comment";
import { Types } from "mongoose";
import { createTransport } from "nodemailer";

const router = Router();

router.post(
  `/:id`,
  [auth, check("text").notEmpty().withMessage("A comment is required")],
  async (req: Request, res: Response) => {
    let id = req.params.id;

    // @ts-ignore
    const user = req.user.id;

    const result = validationResult(req);
    if (!result.isEmpty())
      return res.status(400).json({ errors: result.array() });
    try {
      let property = await Property.findById(id);

      if (!property) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Property not found" }] });
      }

      const { text } = req.body;

      let comment = new Comment({ text, user });
      // @ts-ignore
      property.comments = [...property.comments, comment];
      await comment.save();
      await property.save();

      res.status(200).json({ msg: "Success" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ errors: { msg: "Server error" } });
    }
  }
);

router.delete(
  `/:property_id/:comment_id`,
  auth,
  async (req: Request, res: Response) => {
    let pid = req.params.property_id;
    let cid = req.params.comment_id;

    try {
      let property = await Property.findById(pid);
      if (!property)
        return res
          .status(404)
          .json({ errors: [{ msg: "Property not found" }] });
      let comment = await Comment.findById(cid);

      if (!comment)
        return res.status(404).json({ errors: [{ msg: "Comment not found" }] });

      // @ts-ignore
      property.comments = property.comments.filter(
        (comment: Types.ObjectId) => {
          console.log(!comment.equals(cid));
          return !comment.equals(cid);
        }
      );

      // @ts-ignore

      console.log(property.comments);
      await Comment.findByIdAndDelete(cid);
      await property.save();

      return res.status(200).json({ msg: "Sucesss" });
    } catch (error) {
      console.log(error.message);
      return res.json({
        errors: [
          {
            msg: "Server error",
          },
        ],
      });
    }
  }
);

export default router;
