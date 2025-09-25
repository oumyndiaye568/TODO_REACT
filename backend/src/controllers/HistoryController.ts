import { Request, Response } from "express";
import { HistoriqueService } from "../services/HistoryService.js";

export class HistoryController {
  private static service = new HistoriqueService();

  static async getAll(_: Request, res: Response) {
    try {
      const history = await HistoryController.service.getAll();
      res.json(history);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
