"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const electoralCommisionApi_1 = require("./api/electoralCommisionApi");
dotenv_1.default.config();
exports.app = (0, express_1.default)();
const port = process.env.PORT;
exports.app.use((0, cors_1.default)({ credentials: true, origin: true }));
exports.app.use(express_1.default.json());
const electoralCommission = new electoralCommisionApi_1.ElectoralCommisionApi(process.env.EC_API_KEY);
exports.app.get("/", (req, res) => {
    res.send("hello world");
});
exports.app.post("/postcode", async (req, res) => {
    if (req.headers.origin !== process.env.FRONT_END_DOMAIN)
        res.sendStatus(400);
    console.log(req.body);
    // const result: any = {
    //   pollingStationFound: true,
    //   pollingStations: [
    //     {
    //       address: "123 Privet Drive, London",
    //       postcode: "W12 LKW",
    //       slug: "12345",
    //     },
    //     {
    //       address: "124 dawn road, London",
    //       postcode: "W13 LLW",
    //       slug: "67890",
    //     },
    //   ],
    // };
    const pollingStationResponse = await electoralCommission.verifyPostcode(req.body);
    return res.json(pollingStationResponse);
});
exports.app.post("/submit", (req, res) => {
    console.log(req.body);
    return res.sendStatus(204);
});
exports.app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
