import "express-async-errors";
import app from "./app";
import appConfig from "./config/app-config";

const port = appConfig.PORT;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
