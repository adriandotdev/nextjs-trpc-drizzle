import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { posts } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const postRouter = createTRPCRouter({
  createPost: protectedProcedure
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
    const postResults = await ctx.db.query.posts.findMany({
      where: eq(posts.user_id, ctx.session.userId),
      with: {
        user: {
          columns: {
            password: false,
            date_modified: false,
          },
        },
      },
    });

    return postResults;
  }),
});
