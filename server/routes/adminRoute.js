import express from 'express';
import { 
    addBook,
    getAllBooksAdmin,
    updateBook,
    deleteBook,
    getBookById
} from '../controller/adminController.js';

const adminRoute = express.Router();

// Admin book management routes
adminRoute.post("/books", addBook);
adminRoute.get("/books", getAllBooksAdmin);
adminRoute.get("/books/:bookId", getBookById);
adminRoute.put("/books/:bookId", updateBook);
adminRoute.delete("/books/:bookId", deleteBook);

export default adminRoute;
