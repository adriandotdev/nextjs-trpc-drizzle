import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

import { user } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import * as jwt from "jsonwebtoken";

export const userRouter = createTRPCRouter({
  registerUser: publicProcedure
    .meta({ message: "Register a new user" })
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

      if (userExists.length)
        throw new TRPCError({
          message: "User already exists",
          code: "BAD_REQUEST",
        });

      const result = await ctx.db
        .insert(user)
        .values({
          name: input.name,
          username: input.username,
          password: input.password,
        })
        .returning({
          id: user.id,
        });

      return result;
    }),
  login: publicProcedure
    .meta({ message: "Login an existing user" })
    .input(z.object({ username: z.string(), password: z.string() }))
    .query(async ({ ctx, input }) => {
      const users = await ctx.db
        .select({
          id: user.id,
          username: user.username,
          password: user.password,
        })
        .from(user)
        .where(eq(user.username, input.username));

      if (!users.length)
        throw new TRPCError({ message: "User not found", code: "NOT_FOUND" });

      if (users[0]?.password !== input.password)
        throw new TRPCError({
          message: "Invalid credentials",
          code: "BAD_REQUEST",
        });

      if (!ctx.session) {
        throw new TRPCError({
          message: "Session is not initialized",
          code: "INTERNAL_SERVER_ERROR",
        });
      }

      const accessToken = jwt.sign(
        { user: users[0].id },
        String(process.env.ACCESS_TOKEN_SECRET),
        {
          expiresIn: "15mins",
        },
      );

      return {
        message: "Login successful",
        access_token: accessToken,
        code: 200,
      };
    }),
  getUsers: publicProcedure.query(async ({ ctx }) => {
    const users = await ctx.db.query.user.findMany({
      columns: {
        password: false,
      },
      with: {
        posts: true,
      },
    });

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
