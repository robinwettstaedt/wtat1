'use strict';

import mongoose from 'mongoose';

export const notebookSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        hasAccess: {
            type: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'user' }],
            required: true,
        },
        createdBy: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'user',
            required: true,
        },
        notes: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'note' }],
    },
    { timestamps: true }
);

export const Notebook = mongoose.model('notebook', notebookSchema);
