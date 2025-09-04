import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    book_image: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    categories: [{
        type: String,
        required: true,
        trim: true
    }],
    cost: {
        type: Number,
        default: 0,
        min: 0
    },
    isFree: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Virtual field for free/paid tag
bookSchema.virtual('priceTag').get(function() {
    return this.isFree ? 'Free' : 'Paid';
});

// Virtual field for book name (for backward compatibility)
bookSchema.virtual('bookName').get(function() {
    return this.title;
});

// Virtual field for book image (for backward compatibility)
bookSchema.virtual('bookImage').get(function() {
    return this.book_image;
});

// Ensure virtual fields are serialized
bookSchema.set('toJSON', { virtuals: true });
bookSchema.set('toObject', { virtuals: true });

const Book = mongoose.model('Book', bookSchema);

export default Book;
