import { Router } from 'express';
import controllers from '../controllers';

const router = Router();
const {
  languageController,
  currencyController,
  countryController,
  stateController,
} = controllers;

router.get('/languages', languageController.getAllLanguageList);

router.get('/currencies', currencyController.getAllCurrencyList);

router.get('/country', countryController.getAllCountry);

router.get('/state', stateController.getAllState);

export default router;
