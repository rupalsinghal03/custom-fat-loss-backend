import mongoose from 'mongoose';

const purchaseSchema = new mongoose.Schema({
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    customerName: {
        type: String,
        required: true,
        trim: true
    },
    customerAddress: {
        type: String,
        required: true,
        trim: true
    },
    customerPhone: {
        type: String,
        required: true,
        trim: true
    },
    bookTitle: {
        type: String,
        required: true
    },
    bookPrice: {
        type: Number,
        required: true
    },
    purchaseDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'shipped', 'delivered'],
        default: 'pending'
    }
}, {
    timestamps: true
});

const Purchase = mongoose.model('Purchase', purchaseSchema);

export default Purchase;
