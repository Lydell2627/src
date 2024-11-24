import {Router} from 'express';
import { loginUser, registerUser,logoutUser} from '../controllers/user.controller.js';
import {upload} from '../middlewares/multer.middlware.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { refreshAcessToken } from "./controllers/user.controller.js";
const router=Router()

router.route("/register").post(
    upload.fields([
        {name: "avatar", maxCount: 1},
        {name:"Photo",maxCount: 1}
        
    ]),
    
    
    registerUser
    )
router.route("/login").post(loginUser)


router.route("/logout").post(verifyJWT,logoutUser)
router.route("/refresh-token").post(refreshAcessToken)






export default router