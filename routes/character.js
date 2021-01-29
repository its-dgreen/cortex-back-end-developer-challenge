import express from 'express';

import { catchErrors } from '../middleware/errors.js';
import {
  getAllCharacters,
  getCharacterById,
  createCharacter,
  damageCharacter,
  healCharacter,
  addTempHpToCharacter,
  deleteCharacter,
  updateCharacter,
} from '../controllers/characterController.js';

const router = express.Router();

router.get('/', catchErrors(getAllCharacters));
router.get('/character/:id', catchErrors(getCharacterById));
router.delete('/character/:id', catchErrors(deleteCharacter));
router.put('/character/:id', catchErrors(updateCharacter));
router.post('/create', catchErrors(createCharacter));
router.put('/damage/:id', catchErrors(damageCharacter));
router.put('/heal/:id/:amount', catchErrors(healCharacter));
router.put('/temp/:id/:amount', catchErrors(addTempHpToCharacter));

export default router;
