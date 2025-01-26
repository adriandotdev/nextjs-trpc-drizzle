import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { posts } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const postRouter = createTRPCRouter({
  createPost: publicProcedure
    .meta({ message: "Create a new post" })
    .input(
      z.object({
        name: z.string(),
        content: z.string(),
        user_id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db
        .insert(posts)
        .values({
          name: input.name,
          content: input.content,
          user_id: input.user_id,
        })
        .returning({
          id: posts.id,
        });

      return result;
    }),
  getPosts: protectedProcedure.query(async ({ ctx }) => {
    const postResults = await ctx.db
      .select()
      .from(posts)
      .where(eq(posts.user_id, ctx.session.userId));

    return postResults;
  }),
  getPostsByUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const postResults = await ctx.db.query.posts.findMany({
          where: (table, func) =>
            func.sql`${table.user_id} = (SELECT "id" FROM "t3-app-latest_user" "user" WHERE "user"."username" = ${input.username})`,
        });

        return postResults;
      } catch (err) {
        console.log(err);
      }
    }),
});
