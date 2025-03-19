import express, { Request, Response, Express } from "express";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import router from "./routes";
import errorHandler from "./middlewares/error-handler";
// import cors from 'cors'

dotenv.config();

const app: Express = express();
app.use(express.json());
// app.use()
app.use(router)
app.use(errorHandler)
const port = 8080;
const prisma = new PrismaClient();

app.listen(port, () => {
  console.log("server listening at ", port);
});