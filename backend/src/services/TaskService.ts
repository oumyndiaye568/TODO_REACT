
import  { TaskRepository } from "../repositories/Task.repository.js";
import  { type Tache} from "@prisma/client";
import { HistoriqueService } from "./HistoryService.js";

export class TaskService {
   
    private taskRepository:TaskRepository
     private historiqueservice : HistoriqueService
    constructor(){
        this.taskRepository = new TaskRepository()
        this.historiqueservice = new HistoriqueService()
    }


    async getAll(skip: number = 0, take: number = 10): Promise<{ tasks: Tache[], total: number }>
    {
        const tasks = await this.taskRepository.getAll(skip, take);
        const total = await this.taskRepository.getTotalCount();
        return { tasks, total };
    }

    async getAllForUser(userId: number, skip: number = 0, take: number = 10): Promise<{ tasks: Tache[], total: number }>
    {
        const tasks = await this.taskRepository.getAllForUser(userId, skip, take);
        const total = await this.taskRepository.getTotalCountForUser(userId);
        return { tasks, total };
    }
        
    async getById(id: number): Promise<Tache | null>
    {
        return this.taskRepository.getById(id)
    }
    async create(data: Omit<Tache, "id">): Promise<Tache>
    {
        const task =  await this.taskRepository.create(data)

        const logdata = {
            action:'creation',
            userId: data.userId,
            tacheId: task.id
        }
        await this.historiqueservice.logAction(logdata)

        return task
    }

    async update(id: number,userId:number, data: Partial<Tache>): Promise<Tache>
     {
         const task = await this.taskRepository.getById(id)

         if (!task) throw new Error("Tache non trouve");

         if (task.userId !== userId && !(await this.taskRepository.hasPermission(userId, id))) throw new Error("Non autorisé");
         const logdata = {
             action:'modification',
             userId,
             tacheId:task.id
         }
          await this.historiqueservice.logAction(logdata)

         return this.taskRepository.update(id,data)


     }
        async delete(id: number,userId:number): Promise<void>
        {
            const task = await this.taskRepository.getById(id)

            if (!task)  throw new Error("Tache non trouve");

            if (task.userId !== userId && !(await this.taskRepository.hasPermission(userId, id))) throw new Error("Non autorisé");

            await this.taskRepository.delete(id)

            const logdata = {
             action:'supprimer',
             userId
             }

             await this.historiqueservice.logAction(logdata)
        }


    async delegateTask(userId: number, taskId: number, delegateUserId: number): Promise<void>
    {
        const task = await this.taskRepository.getById(taskId);
        if (!task) throw new Error("Tâche introuvable");

        if (task.userId !== userId) throw new Error("Non autorisé");

        // Ajouter une permission pour déléguer la tâche
        await this.taskRepository.addDelegate(taskId, delegateUserId);
const logdata = {
    action: 'delegation',
    userId,
    tacheId: taskId
};
await this.historiqueservice.logAction(logdata);
}

async getAssignees(taskId: number): Promise<any[]> {
return this.taskRepository.getAssignees(taskId);
}

async removeAssignee(userId: number, taskId: number, assigneeId: number): Promise<void> {
const task = await this.taskRepository.getById(taskId);
if (!task) throw new Error("Tâche introuvable");

if (task.userId !== userId) throw new Error("Non autorisé");

await this.taskRepository.removeAssignee(taskId, assigneeId);

const logdata = {
  action: 'suppression_delegation',
  userId,
  tacheId: taskId
};
await this.historiqueservice.logAction(logdata);
}

async getDelegatedTasks(userId: number): Promise<Tache[]> {
return this.taskRepository.getDelegatedTasks(userId);
}


    

}
