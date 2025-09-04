import express from 'express';
import { 
    signup,
    loginWithEmail,
    sendOTP,
    verifyOTPAndLogin,
    getAllBooks,
    getFreeBooks,
    getAllCategories,
    getBookById,
    purchaseBook,
    getCollection,
    addNewCollection,
    getProfile
} from '../controller/userController.js';

const route = express.Router();

// Authentication routes
route.post("/signup", signup);
route.post("/login/email", loginWithEmail);
route.post("/login/phone/send-otp", sendOTP);
route.post("/login/phone/verify-otp", verifyOTPAndLogin);

// Book routes
route.get("/books", getAllBooks);
route.get("/getFreeBooks", getFreeBooks);
route.get("/categories", getAllCategories);
route.get("/books/:bookId", getBookById);
route.post("/purchase", purchaseBook);

// Collection routes
route.get("/getCollection/:userId", getCollection);
route.post("/addNewCollection", addNewCollection);

// Get user profile
route.get("/profile/:userId", getProfile);

export default route;