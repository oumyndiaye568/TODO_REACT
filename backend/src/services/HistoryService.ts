import { Historique } from "@prisma/client";
import { HistoriqueClass } from "../repositories/HistoryRepository.js";

export class HistoriqueService {
    private historiqueservice = new HistoriqueClass()
    async logAction(data:{action:string,userId:number,tacheId?:number})
    {
         this.historiqueservice.create(data)
        
    }

    async getAll():Promise<Historique[]>{
        return this.historiqueservice.getAll()
    }

}