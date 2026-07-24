import "dotenv/config"; 
import app from "./src/app.ts"; 

app.listen(process.env.PORT, () =>
  console.log(`Example app listening on port ${process.env.PORT}!`),
);
