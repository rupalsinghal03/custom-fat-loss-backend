import Book from '../model/bookModal.js';

// Add a new book
export const addBook = async (req, res) => {
    try {
        const { title, book_image, description, categories, cost } = req.body;

        // Validation
        if (!title || !book_image || !description || !categories || categories.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Title, book image, description, and at least one category are required"
            });
        }

        // Validate categories array
        if (!Array.isArray(categories)) {
            return res.status(400).json({
                success: false,
                message: "Categories must be an array"
            });
        }

        // Determine if book is free or paid
        const isFree = !cost || cost === 0;

        // Create new book
        const bookData = new Book({
            title,
            book_image,
            description,
            categories,
            cost: cost || 0,
            isFree
        });

        const savedBook = await bookData.save();

        res.status(201).json({
            success: true,
            message: "Book added successfully",
            data: savedBook
        });

    } catch (error) {
        console.error('Add book error:', error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Get all books (admin view with full details)
export const getAllBooksAdmin = async (req, res) => {
    try {
        const books = await Book.find({})
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "Books retrieved successfully",
            count: books.length,
            data: books
        });

    } catch (error) {
        console.error('Get books admin error:', error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Update a book
export const updateBook = async (req, res) => {
    try {
        const { bookId } = req.params;
        const { title, book_image, description, categories, cost } = req.body;

        // Validation
        if (!title || !book_image || !description || !categories || categories.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Title, book image, description, and at least one category are required"
            });
        }

        // Determine if book is free or paid
        const isFree = !cost || cost === 0;

        // Update book
        const updatedBook = await Book.findByIdAndUpdate(
            bookId,
            {
                title,
                book_image,
                description,
                categories,
                cost: cost || 0,
                isFree,
                updatedAt: new Date()
            },
            { new: true, runValidators: true }
        );

        if (!updatedBook) {
            return res.status(404).json({
                success: false,
                message: "Book not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Book updated successfully",
            data: updatedBook
        });

    } catch (error) {
        console.error('Update book error:', error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Delete a book
export const deleteBook = async (req, res) => {
    try {
        const { bookId } = req.params;

        const deletedBook = await Book.findByIdAndDelete(bookId);

        if (!deletedBook) {
            return res.status(404).json({
                success: false,
                message: "Book not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Book deleted successfully",
            data: deletedBook
        });

    } catch (error) {
        console.error('Delete book error:', error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Get book by ID
export const getBookById = async (req, res) => {
    try {
        const { bookId } = req.params;

        const book = await Book.findById(bookId);

        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Book not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Book retrieved successfully",
            data: book
        });

    } catch (error) {
        console.error('Get book by ID error:', error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};
