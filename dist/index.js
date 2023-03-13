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
app.post("/postcode", (req, res) => {
    console.log(req);
    if (req.headers.origin !== process.env.FRONT_END_DOMAIN)
        res.sendStatus(400);
    const result = {
        pollingStationFound: true,
        pollingStations: [
            {
                address: "123 Privet Drive, London",
                postcode: "W12 LKW",
                slug: "12345",
            },
            {
                address: "124 dawn road, London",
                postcode: "W13 LLW",
                slug: "67890",
            },
        ],
    };
    return res.json(result);
});
app.post("/submit", (req, res) => {
    console.log(req.body);
    return res.sendStatus(204);
});
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
