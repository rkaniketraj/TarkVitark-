import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from './app.js';
//import DebateRoom from './models/debateRoom.model.js'; // Adjust the path as necessary
import { DebateRoom } from './models/debateRoom.model.js';

dotenv.config({
    path: './.env'
});

connectDB()
.then(() => {
    app.on("error", (error) => {
        console.log("ERROR:", error);
        throw error;
    });

    app.listen(process.env.PORT || 8000, () => {
        console.log(` Server is running at port: ${process.env.PORT}`);
    });

    // Periodically update debate statuses
    setInterval(async () => {
        const now = new Date();
        try {
            const result = await DebateRoom.updateMany(
                { status: "scheduled", scheduledAt: { $lte: now } },
                { $set: { status: "ongoing" } }
            );
            if (result.modifiedCount > 0) {
                console.log(`${result.modifiedCount} debate(s) moved to ongoing.`);
            }
        } catch (err) {
            console.error("Error updating debate statuses:", err);
        }
    }, 60 * 1000); // Every 60 seconds
})
.catch((err) => {
    console.log("MongoDB connection failed!", err);
    process.exit(1);
});
