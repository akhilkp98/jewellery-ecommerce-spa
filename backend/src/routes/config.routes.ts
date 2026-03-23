import { Router } from 'express';
import { getTaxes, createTax, updateTax, deleteTax, getCategories, getMetalTypes } from '../controllers/config.controller';

const router = Router();

router.get('/taxes', getTaxes);
router.post('/taxes', createTax);
router.patch('/taxes/:id', updateTax);
router.delete('/taxes/:id', deleteTax);

router.get('/categories', getCategories);
router.get('/metal-types', getMetalTypes);

export default router;
