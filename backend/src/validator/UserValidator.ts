import { z } from "zod";
import { ErreurMessages } from "../utils/errorsMessage.js";

export const CreateUserSchema = z.object({
    name: z.string().min(1, ErreurMessages.missingUserName),
    login: z.string().email(ErreurMessages.invalidEmail),
    password:z.string().min(4).max(8)
});
