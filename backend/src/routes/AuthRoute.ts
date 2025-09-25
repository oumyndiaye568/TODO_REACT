

import { AuthController } from "../controllers/Auth.controller.js"

import { Router } from "express"

const router = Router()

router.post('/',AuthController.login)
router.post('/create',AuthController.create)


export default router