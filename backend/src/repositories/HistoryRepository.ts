import { type Historique, PrismaClient } from "@prisma/client";

export class HistoriqueClass {
    private  prisma  = new PrismaClient()
    async create(data :{action:string,userId:number,tacheId?:number})
    {
         return await this.prisma.historique.create({
            data
        })
    }
    async getAll():Promise<Historique[]>
    {
        return this.prisma.historique.findMany({
            include:{user:true,tache:true},
            orderBy:{date:'desc'}
            
        })
    }
}
