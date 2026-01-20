import {createContext} from "react";
import type {AuthContextType} from "../types/auth.context.ts";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{}>;