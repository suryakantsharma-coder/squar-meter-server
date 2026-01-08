"use strict";
// {
//   _id: ObjectId,
//   projectId: ObjectId("..."),
//   unitNumber: "A-1002",
//   block: "Block B",
//   areaSqft: 1200,
//   price: 12000000,
//   pricePerSqft: 10000,
//   images: [
//     "https://example.com/unit1.jpg"
//   ],
//   status: "Available",
//   buyerId: ObjectId("..."),
//   bookedDate: ISODate("2025-02-18"),
//   createdAt: ISODate(),
//   updatedAt: ISODate()
// }
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Unit = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const UintSchema = new mongoose_1.Schema({
    projectId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Project', required: true },
    unitNumber: { type: String, required: true, trim: true },
    block: { type: String, required: true, trim: true },
    areaSqft: { type: Number, required: true },
    price: { type: Number, required: true },
    pricePerSqft: { type: Number, required: true },
    images: { type: [String], default: [] },
    status: {
        type: String,
        required: true,
        enum: ['Available', 'Booked', 'Sold'],
        default: 'Available',
    },
    buyerId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', default: null },
    bookedDate: { type: Date, default: null },
}, { timestamps: true });
exports.Unit = mongoose_1.default.model('Units', UintSchema);
