import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "../../../backend/src/routes";
import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

export const trpc: ReturnType<typeof createTRPCReact<AppRouter>> =
  createTRPCReact<AppRouter>();
type RouterInput = inferRouterInputs<AppRouter>;
type RouterOutput = inferRouterOutputs<AppRouter>;
