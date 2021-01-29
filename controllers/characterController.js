import { Character } from '../models/Character.js';

const rollDice = max => {
  return 1 + Math.floor(Math.random() * max);
};

export const getAllCharacters = async (req, res) => {
  const allCharacters = await Character.find();

  if (allCharacters === null) {
    res.status(404).json({ message: 'Not Found' });
  } else {
    res.status(200).json({ characters: allCharacters });
  }
};

export const getCharacterById = async (req, res) => {
  const character = await Character.findOne({ _id: req.params.id });
  if (character === null) {
    res.status(404).json({ message: 'Not Found' });
  } else {
    res.status(200).json({ character: character });
  }
};

export const createCharacter = async (req, res) => {
  const newCharacter = new Character(req.body);
  newCharacter.level = newCharacter.classes.reduce((prev, current) => {
    return prev + current.classLevel;
  }, 0);

  let hp = 0;
  if (req.query.hp === 'rolled') {
    newCharacter.classes.forEach(characterClass => {
      for (let step = characterClass.classLevel; step > 0; step--) {
        hp += rollDice(characterClass.hitDiceValue);
      }
    });
  } else {
    newCharacter.classes.forEach(characterClass => {
      hp += (characterClass.hitDiceValue / 2 + 1) * characterClass.classLevel;
    });
  }
  hp = hp + (newCharacter.stats.constitution - 10) / 2;

  newCharacter.currentHp = hp;
  newCharacter.maxHp = hp;
  newCharacter.tempHp = 0;
  await newCharacter.save();
  res.status(201).json({ character: newCharacter });
};

export const damageCharacter = async (req, res) => {
  const character = await Character.findOne({ _id: req.params.id });

  const dealDamage = damageValue => {
    if (character.tempHp > 0) {
      character.tempHp -= damageValue;
      if (character.tempHp < 0) {
        character.currentHp -= Math.abs(character.tempHp);
        character.tempHp = 0;
      }
    }
  };

  if (character === null) {
    res.status(404).json({ message: 'Character Not Found' });
  } else {
    let resistance = character.defenses.find(
      defense =>
        defense.type.toLowerCase() === req.body.damageType.toLowerCase()
    );
    if (resistance === undefined) {
      // This means the character does not have any defenses against the type
      dealDamage(req.body.value);
      character.lastEdited = Date.now();
      await character.save();
      res.status(200).json({
        message: `Dealt ${req.body.value} ${req.body.damageType} damage to ${character.name}`,
        character: character,
      });
    } else {
      switch (resistance.defense.toLowerCase()) {
        case 'resistance':
          let damage = Math.round(req.body.value / 2);
          dealDamage(damage);
          character.lastEdited = Date.now();
          await character.save();
          res.status(200).json({
            message: `Dealt ${damage} ${req.body.damageType} damage to ${character.name}, ${character.name} was resistant to the damage!`,
            character: character,
          });
          break;
        case 'immunity':
          character.lastEdited = Date.now();
          res.status(200).json({
            message: `Dealt 0 ${req.body.damageType} damage to ${character.name}, ${character.name} was immune to the damage!`,
            character: character,
          });
          break;
        default:
          dealDamage(req.body.value);
          character.lastEdited = Date.now();
          await character.save();
          res.status(200).json({
            message: `Dealt ${req.body.value} ${req.body.damageType} damage to ${character.name}`,
            character: character,
          });
          break;
      }
    }
  }
};

export const healCharacter = async (req, res) => {
  const character = await Character.findOne({ _id: req.params.id });
  if (character === null) {
    res.status(404).json({ message: 'Not Found' });
  } else {
    character.currentHp += req.params.amount;
    if (character.currentHp > character.maxHp) {
      character.currentHp = character.maxHp;
    }
    character.lastEdited = Date.now();
    await character.save();
    res.status(200).json({
      message: `Healed ${character.name} for ${req.params.amount} hit points`,
      character: character,
    });
  }
};

export const addTempHpToCharacter = async (req, res) => {
  const character = await Character.findOne({ _id: req.params.id });
  if (character === null) {
    res.status(404).json({ message: 'Not Found' });
  } else {
    character.tempHp += parseInt(req.params.amount);
    character.lastEdited = Date.now();
    await character.save();
    res.status(200).json({
      message: `Added ${req.params.amount} temporary hit points to ${character.name}`,
      character: character,
    });
  }
};

export const deleteCharacter = async (req, res) => {
  const character = await Character.deleteOne({ _id: req.params.id });
  res.status(200).json({
    success: true,
    message: `Deleted character with ID ${req.params.id}`,
  });
};

export const updateCharacter = async (req, res) => {
  const character = await Character.findOne({ _id: req.params.id });
  if (character === null) {
    res.status(404).json({ message: 'Not Found' });
  } else {
    req.body.character.lastEdited = Date.now();
    const updatedCharacter = await Character.findOneAndUpdate(
      { _id: req.params.id },
      req.body.character,
      {
        new: true,
        runValidators: true,
      }
    ).exec();
    res.status(200).json({
      success: true,
      message: `Updated character with ID ${req.params.id}`,
      character: updatedCharacter,
    });
  }
};
