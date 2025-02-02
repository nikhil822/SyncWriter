import express, { Request, Response, Express } from "express";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import router from "./routes";

dotenv.config();

const app: Express = express();
app.use(express.json());
app.use(router)
const port = 8080;
const prisma = new PrismaClient();

app.listen(port, () => {
  console.log("server listening at ", port);
});