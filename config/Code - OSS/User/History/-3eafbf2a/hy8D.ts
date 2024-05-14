import connectDB from "./database/connection";
import App from "express"
import bodyParser from "body-parser";
import { userRouter } from "./controllers/User";
import { coachingRouter } from "./controllers/Coaching";
import { metricsRouter } from "./controllers/CoachingProgram";
import { coachProgram } from "./controllers/CoachProgram";

const app = App();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/user', userRouter);
app.use('/coaching', coachingRouter)
app.use('/metrics', metricsRouter)
app.use('/program', coachProgram)
try {
}
catch(err){}
finally{
    connectDB()
    app.listen(9999, async () => {
        console.log("Server Started")
    })
}
