import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const CharacterSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  level: {
    type: Number,
    required: true,
    min: 1,
    max: 20,
  },
  currentHp: {
    type: Number,
    required: true,
  },
  maxHp: {
    type: Number,
    required: true,
  },
  tempHp: {
    type: Number,
  },
  stats: {
    strength: { type: Number, required: true, min: 1, max: 30 },
    dexterity: { type: Number, required: true, min: 1, max: 30 },
    constitution: { type: Number, required: true, min: 1, max: 30 },
    intelligence: { type: Number, required: true, min: 1, max: 30 },
    wisdom: { type: Number, required: true, min: 1, max: 30 },
    charisma: { type: Number, required: true, min: 1, max: 30 },
  },
  classes: [
    {
      name: { type: String, required: true },
      hitDiceValue: { type: Number, required: true },
      classLevel: { type: Number, required: true, min: 1, max: 20 },
    },
  ],
  defenses: [
    {
      type: { type: String, required: true },
      defense: { type: String, required: true },
    },
  ],
  items: [
    {
      name: {
        type: String,
        trim: true,
        required: true,
      },
      modifier: {
        affectedObject: { type: String, required: true },
        affectedValue: { type: String, required: true },
        value: { type: Number, required: true },
      },
    },
  ],
  created: {
    type: Date,
    default: Date.now,
  },
  lastEdited: {
    type: Date,
    default: Date.now,
  },
});

export const Character = model('character', CharacterSchema, 'characters');
