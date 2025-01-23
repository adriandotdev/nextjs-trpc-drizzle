import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

import { user } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const userRouter = createTRPCRouter({
  registerUser: publicProcedure
    .input(
      z.object({
        name: z.string(),
        username: z.string(),
        password: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userExists = await ctx.db
        .select()
        .from(user)
        .where(eq(user.username, input.username));

      if (userExists.length) throw new Error("User already exists");

      const result = await ctx.db.insert(user).values({
        name: input.name,
        username: input.username,
        password: input.password,
      });

      console.log(result);
    }),
  getUsers: publicProcedure.query(async ({ ctx }) => {
    const users = await ctx.db.select().from(user);

    return users;
  }),
  getUserById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const resultUser = await ctx.db
        .select()
        .from(user)
        .where(eq(user.id, input.id));

      return resultUser;
    }),
  getUserByUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      const resultUser = await ctx.db
        .select()
        .from(user)
        .where(eq(user.username, input.username));

      if (!resultUser.length) throw new Error("User not found");

      return resultUser;
    }),
  removeUserByUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userExists = await ctx.db
        .select()
        .from(user)
        .where(eq(user.username, input.username));

      if (!userExists.length) throw new Error("User not found");

      await ctx.db.delete(user).where(eq(user.username, input.username));
    }),
});
