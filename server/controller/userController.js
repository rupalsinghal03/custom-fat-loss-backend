import User from '../model/userModal.js'
import OTP from '../model/otpModal.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Book from '../model/bookModal.js'
import Purchase from '../model/purchaseModal.js'
import Collection from '../model/collectionModal.js'

// Generate OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Hash password
const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

// Compare password
const comparePassword = async (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword);
};

// Generate JWT token
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '7d' });
};

// Signup API
export const signup = async (req, res) => {
    try {
        const { fullname, phone, email, college, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ 
            $or: [{ email }, { phone }] 
        });

        if (existingUser) {
            return res.status(400).json({ 
                success: false, 
                message: existingUser.email === email ? "Email already registered" : "Phone number already registered" 
            });
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Create new user
        const userData = new User({
            fullname,
            phone,
            email,
            college,
            password: hashedPassword
        });

        const savedUser = await userData.save();

        // Remove password from response
        const userResponse = savedUser.toObject();
        delete userResponse.password;

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: userResponse
        });

    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ 
            success: false, 
            message: "Internal server error",
            error: error.message 
        });
    }
};

// Login with email and password
export const loginWithEmail = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Check password
        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Generate token
        const token = generateToken(user._id);

        // Remove password from response
        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: userResponse,
            token
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Send OTP for phone login
export const sendOTP = async (req, res) => {
    try {
        const { phone } = req.body;

        if (!phone) {
            return res.status(400).json({
                success: false,
                message: "Phone number is required"
            });
        }

        // Check if user exists
        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found with this phone number"
            });
        }

        // Generate OTP
        const otp = generateOTP();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Save OTP
        await OTP.findOneAndUpdate(
            { phone },
            { otp, expiresAt },
            { upsert: true, new: true }
        );

        // In a real application, you would integrate with SMS service here
        // For now, we'll just return the OTP in response (for testing)
        console.log(`OTP for ${phone}: ${otp}`);

        res.status(200).json({
            success: true,
            message: "OTP sent successfully",
            data: { phone, otp } // Remove otp in production
        });

    } catch (error) {
        console.error('Send OTP error:', error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Verify OTP and login
export const verifyOTPAndLogin = async (req, res) => {
    try {
        const { phone, otp } = req.body;

        if (!phone || !otp) {
            return res.status(400).json({
                success: false,
                message: "Phone number and OTP are required"
            });
        }

        // Find and verify OTP
        const otpRecord = await OTP.findOne({ phone, otp });
        if (!otpRecord) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }

        // Check if OTP is expired
        if (new Date() > otpRecord.expiresAt) {
            await OTP.deleteOne({ phone });
            return res.status(400).json({
                success: false,
                message: "OTP has expired"
            });
        }

        // Find user
        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Delete used OTP
        await OTP.deleteOne({ phone });

        // Generate token
        const token = generateToken(user._id);

        // Remove password from response
        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: userResponse,
            token
        });

    } catch (error) {
        console.error('Verify OTP error:', error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Get all books
export const getAllBooks = async (req, res) => {
    try {
        const books = await Book.find({})
            .select('title book_image isFree priceTag')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "Books retrieved successfully",
            count: books.length,
            data: books
        });

    } catch (error) {
        console.error('Get books error:', error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Get free books only
export const getFreeBooks = async (req, res) => {
    try {
        const freeBooks = await Book.find({ isFree: true })
            .select('title book_image isFree priceTag')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "Free books retrieved successfully",
            count: freeBooks.length,
            data: freeBooks
        });

    } catch (error) {
        console.error('Get free books error:', error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Get all unique categories
export const getAllCategories = async (req, res) => {
    try {
        // Get all unique categories from books collection
        const categories = await Book.distinct('categories');
        
        // Filter out any empty or null categories and sort alphabetically
        const validCategories = categories
            .filter(category => category && category.trim() !== '')
            .sort();

        res.status(200).json({
            success: true,
            message: "Categories retrieved successfully",
            count: validCategories.length,
            data: validCategories
        });

    } catch (error) {
        console.error('Get categories error:', error);
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

        if (!bookId) {
            return res.status(400).json({
                success: false,
                message: "Book ID is required"
            });
        }

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

// Purchase a book
export const purchaseBook = async (req, res) => {
    try {
        const { bookId, customerName, customerAddress, customerPhone } = req.body;

        // Validation
        if (!bookId || !customerName || !customerAddress || !customerPhone) {
            return res.status(400).json({
                success: false,
                message: "Book ID, customer name, address, and phone are required"
            });
        }

        // Check if book exists
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Book not found"
            });
        }

        // Create purchase order
        const purchaseData = new Purchase({
            bookId,
            customerName,
            customerAddress,
            customerPhone,
            bookTitle: book.title,
            bookPrice: book.cost || 0
        });

        const savedPurchase = await purchaseData.save();

        res.status(201).json({
            success: true,
            message: "Book purchase order created successfully",
            data: {
                purchaseId: savedPurchase._id,
                bookTitle: book.title,
                customerName,
                customerPhone,
                status: 'pending'
            }
        });

    } catch (error) {
        console.error('Purchase book error:', error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Get user collections
export const getCollection = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        // Get collections with populated book details
        const collections = await Collection.find({ userId })
            .populate('books.bookId', 'title book_image isFree cost')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "Collections retrieved successfully",
            count: collections.length,
            data: collections
        });

    } catch (error) {
        console.error('Get collections error:', error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Add new collection
export const addNewCollection = async (req, res) => {
    try {
        const { userId, collection_name } = req.body;

        // Validation
        if (!userId || !collection_name) {
            return res.status(400).json({
                success: false,
                message: "User ID and collection name are required"
            });
        }

        // Check if collection name already exists for this user
        const existingCollection = await Collection.findOne({ 
            userId, 
            collection_name: { $regex: new RegExp(`^${collection_name}$`, 'i') }
        });

        if (existingCollection) {
            return res.status(400).json({
                success: false,
                message: "Collection with this name already exists"
            });
        }

        // Create new collection
        const collectionData = new Collection({
            userId,
            collection_name,
            books: []
        });

        const savedCollection = await collectionData.save();

        res.status(201).json({
            success: true,
            message: "Collection created successfully",
            data: savedCollection
        });

    } catch (error) {
        console.error('Add collection error:', error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Get user profile
export const getProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });
    }

    const user = await User.findById(userId).select('fullname email phone');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.fullname,
        email: user.email,
        phone: user.phone,
        profileImage: null // User model doesn't have profileImage field yet
      }
    });
  } catch (error) {
    console.error('Error getting user profile:', error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

