export interface IRepository<T>
{
    getAll(): Promise<T[]>;
    getById(id: number): Promise<T | null>;
    create(data: Omit<T, "id">): Promise<T>;
    update(id: number, data: Partial<T>): Promise<T>;
    delete(id: number): Promise<void>;
     
}