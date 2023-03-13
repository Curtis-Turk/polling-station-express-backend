"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
app.use((0, cors_1.default)({ credentials: true, origin: true }));
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.send("hello world");
});
app.post("/submit", (req, res) => {
    return res.send("hello world");
    // res.status(whatever).json(json goes here)
    // return res.sendStatus(204);
});
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
