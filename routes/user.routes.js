import {Router} from 'express';
import { registerUser } from '../controllers/user.controller.js';
import {upload} from '../middlewares/multer.middlware.js';
const router=Router()

router.route("/register").post(
    upload.fields([
        {name: "avatar", maxCount: 1},
        
    ]),
    
    
    registerUser
    )


export default router