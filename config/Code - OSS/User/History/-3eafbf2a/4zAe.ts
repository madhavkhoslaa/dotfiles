import connectDB from "./database/connection";
import App from "express";
import bodyParser from "body-parser";
import { userRouter } from "./controllers/User";
import { coachingRouter } from "./controllers/Coaching";
import { metricsRouter } from "./controllers/Metrics";
import { coachProgram } from "./controllers/CoachProgram";
import { loginRouter } from "./controllers/Auth";
Config();
const app = App();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/user", userRouter);
app.use("/coaching", coachingRouter);
app.use("/metrics", metricsRouter);
app.use("/program", coachProgram);
app.use("/auth", loginRouter);

connectDB().then(() => {
  app.listen(9999, async () => {
    console.log("Server Started");
  });
});
