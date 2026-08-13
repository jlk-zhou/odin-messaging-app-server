import "dotenv/config";
import app from "./src/app.ts";

app.listen(process.env.PORT, () =>
  console.log(
    `Better Auth Template App - listening on port ${process.env.PORT}`,
  ),
);
