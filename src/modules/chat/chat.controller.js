import { Router } from "express";
import { findonechat } from "./chat/chat.service.js";
const router = Router()



router.get("/findonechat/:destId", findonechat)

export default router