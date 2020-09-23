import express, { Request, Response } from "express";
import { connectDB } from "./config/db";
import cors from "cors";
import users from "./routes/users";
import properties from "./routes/property";
import cookieParser from "cookie-parser";
import path from "path";
import comment from "./routes/comment";
import { config } from "dotenv";
// import csrf from "csurf";

const app = express();

config();

// var csrfProtection = csrf({ cookie: true });

const PORT = process.env.PORT || 5000;

(async () => {
  const URI: string = process.env.mongoURI!;
  await connectDB(URI);

  // app.use("/api/files", express.static(path.join(__dirname, "files")));
  app.use(express.static("static"));
  app.use(express.json());
  app.use(cors());
  app.use(cookieParser());
  // app.all("*", csrfProtection, function (req, res) {
  //   res.cookie("XSRF-TOKEN", req.csrfToken());
  // });

  app.use("/api/users", users);
  app.use("/api/properties", properties);
  app.use("/api/comments", comment);

  app.get("/", (req, res) => {
    res.send({ now: Date.now() });
  });

  // app.all("*", (req: Request, res: Response) => res.csrfToken())

  var server = app.listen(PORT, () => {
    // app
    console.log(`server running on port ${PORT}`);
  });
  server.on("error", (err) => console.log(err));
  server.on("close", () => server.close());

  process.on("uncaughtException", () => server.close());
})();
