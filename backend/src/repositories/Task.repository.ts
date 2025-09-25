import  {PrismaClient, type Tache} from "@prisma/client";

import type { IRepository } from "./Irepository.js";

export class TaskRepository implements IRepository<Tache>
{
    private prisma : PrismaClient 

    constructor()
    {
       this.prisma = new PrismaClient()
    }

    async getAll(skip: number = 0, take: number = 10): Promise<Tache[]>
    {
          return this.prisma.tache.findMany({
            skip,
            take,
            orderBy: { id: 'desc' },
            include: { user: true, permission: { include: { user: true } } }
          })
     }

    async getTotalCount(): Promise<number>
    {
        return this.prisma.tache.count();
    }

    async getAllForUser(userId: number, skip: number = 0, take: number = 10): Promise<Tache[]>
    {
        return this.prisma.tache.findMany({
            where: {
                OR: [
                    { userId: userId },
                    { permission: { some: { userId: userId } } }
                ]
            },
            skip,
            take,
            orderBy: { id: 'desc' },
            include: { user: true, permission: { include: { user: true } } }
        });
    }

    async getTotalCountForUser(userId: number): Promise<number>
    {
        return this.prisma.tache.count({
            where: {
                OR: [
                    { userId: userId },
                    { permission: { some: { userId: userId } } }
                ]
            }
        });
    }
    
     async getById(id: number): Promise<Tache | null>
     {
        return this.prisma.tache.findUnique({
            where: { id },
            include: { user: true }
        })
    }

    async create(data: Omit<Tache, "id">): Promise<Tache>{
        return this.prisma.tache.create({
            data,
            include:{user:true}
            
        })
    }

    async update(id: number, data: Partial<Tache>): Promise<Tache> {
       return this.prisma.tache.update({
          where:{id},
          data,
          include: { user: true }
        })
    }
    
    async delete(id: number): Promise<void>{
         await this.prisma.tache.delete({
            where:{id}
        })
    }

    async addDelegate(taskId: number, userId: number): Promise<void> {
    await this.prisma.permission.create({
      data: { taskId, userId },
    });
    
    }

     hasPermission = async(userId: number, taskId: number) : Promise<boolean> =>{
        const permission = await this.prisma.permission.findUnique({
             where:{
                userId_taskId:{
                 userId,
                 taskId
                }
             }
         })
         // if (permission)
         // {
         //     return true
         // }else
         // {
         //     return false
         // }
         return !!permission

     }

     async getDelegatedTasks(userId: number): Promise<Tache[]> {
         const tasks = await this.prisma.tache.findMany({
             where: {
                 permission: {
                     some: {
                         userId: userId
                     }
                 },
                 userId: {
                     not: userId // Exclude tasks owned by the user
                 }
             },
             include: {
                 user: true
             }
         });
         console.log(`Delegated tasks for user ${userId}:`, tasks);
         return tasks;
     }

     async getAssignees(taskId: number): Promise<any[]> {
         return this.prisma.permission.findMany({
             where: { taskId },
             include: { user: true }
         });
     }

     async removeAssignee(taskId: number, userId: number): Promise<void> {
         await this.prisma.permission.deleteMany({
             where: { taskId, userId }
         });
     }

}