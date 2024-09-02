import { Router } from "express";
import controllers from "../controllers";
import middlewares from "../middlewares";
import validations from "../validations";

const router = Router();
const { salesTaxValidator } = validations;
const { salesTaxController } = controllers;
const { authMiddleware, resourceAccessMiddleware, validateMiddleware } =
  middlewares;

router.post(
  "/admin/sales-tax",
  authMiddleware,
  resourceAccessMiddleware(["admin"]),
  validateMiddleware({
    schema: salesTaxValidator.addSalesTaxSchema,
  }),
  salesTaxController.addSalesTax
);

router.get(
  "/admin/sales-tax",
  authMiddleware,
  resourceAccessMiddleware(["admin"]),
  salesTaxController.salesTaxList
);

router.put(
  "/admin/sales-tax",
  authMiddleware,
  resourceAccessMiddleware(["admin"]),
  validateMiddleware({
    schema: salesTaxValidator.updateSalesTaxSchema,
  }),
  salesTaxController.updateSalesTaxList
);

router.get(
  '/sales-tax',
  authMiddleware,
  resourceAccessMiddleware(['admin', 'user']),
  salesTaxController.getSalesTax,
);

export default router;
