import connectDB from "./database/connection";
import App from "express";
import bodyParser from "body-parser";
import { userRouter } from "./controllers/User";
import { coachingRouter } from "./controllers/Coaching";
import { metricsRouter } from "./controllers/Metrics";
import { coachProgram } from "./controllers/CoachProgram";
import { loginRouter } from "./controllers/Auth";
import { config } from "./config/config";
import { programRouter } from "./controllers/ExerciseView";
import { Auth } from "./middleware/Auth";
import { coachViewRouter } from "./controllers/CoachView";
console.log(config);
const app = App();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/user", userRouter);
app.use("/coaching", coachingRouter);
app.use("/metrics", metricsRouter);
app.use("/program-meta", coachProgram);
app.use("/auth", loginRouter);
app.use("/program", programRouter);
app.use("/coachHome", coachViewRouter);

connectDB(config.mongoose_string).then(() => {
  app.listen(config.port, async () => {
    console.log("Server Started");
  });
});
