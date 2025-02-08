import express from 'express' ;
import { checkAuth, login, logout, signup, updateProfile } from '../controllers/auth.controller.js';

const router = express.Router() ;

router.post("/signup" , signup);
router.post("/login" , login);
router.post("/logout" , logout);
router.post("/check" , checkAuth);

router.put("/update-profile" , updateProfile)

export default router ;