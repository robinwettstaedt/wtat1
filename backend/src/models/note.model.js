'use strict';

import mongoose from 'mongoose';

export const noteSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            default: 'Note',
        },
        content: {
            required: true,
            default: '',
        },
        notebook: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'notebook',
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
        lastUpdatedBy: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'user',
            required: true,
        },
    },
    { timestamps: true }
);

export const Note = mongoose.model('note', noteSchema);
