import mongoose, { Schema, Document } from 'mongoose';

export interface ILead extends Document {
  name: string;

  contact: {
    phone: string;
    email?: string;
  };

  leadSource: 'Facebook' | 'Referral' | 'Walkin' | 'Website' | 'Campaign';

  status: 'New' | 'Negotiation' | 'Booked' | 'Site Visit' | 'Contacted';

  leadScore: number;

  interestedProjects: {
    projectId: mongoose.Types.ObjectId;
    units: mongoose.Types.ObjectId[]; // <-- nested references
  }[];
}

const LeadSchema = new Schema<ILead>(
  {
    name: { type: String, required: true },

    contact: {
      phone: { type: String, required: true, unique: true },
      email: { type: String },
    },

    leadSource: {
      type: String,
      enum: ['Facebook', 'Referral', 'Walkin', 'Website', 'Campaign'],
      default: 'Website',
    },

    status: {
      type: String,
      enum: ['New', 'Negotiation', 'Booked', 'Site Visit', 'Contacted'],
      default: 'New',
    },

    leadScore: { type: Number, default: 0 },

    interestedProjects: [
      {
        projectId: {
          type: Schema.Types.ObjectId,
          ref: 'Project',
          required: true,
        },
        units: [
          {
            type: Schema.Types.ObjectId,
            ref: 'Units',
          },
        ],
      },
    ],
  },
  { timestamps: true },
);

export const Lead = mongoose.model<ILead>('Lead', LeadSchema);
