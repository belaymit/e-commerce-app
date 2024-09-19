import express, { Express } from "express";
import { PORT } from "./secrets";
import rootRouter from "./routes";
import { PrismaClient } from "@prisma/client";
import { errorMiddleWare } from "./middlewares/errors";

const app: Express = express()

app.use(express.json());

app.use('/api', rootRouter);

export const prismaClient = new PrismaClient({
  log: ["query", "info", "warn", "error"]
})

app.use(errorMiddleWare)
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`)
})