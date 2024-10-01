import { UserModel } from "../model/user";
import { privateProcedure, router } from "../trpc";
import { z } from "zod";

export const userRouter = router({
  zerodhaUpdateSettings: privateProcedure
    .input(
      z.object({
        encToken: z.string().optional(),
        zerodhaUserId: z.string().optional(),
      })
    )
    .mutation(async (opts) => {
      try {
        const { user } = opts.ctx;
        const data = { ...opts.input };

        await UserModel.updateOne(
          { _id: user.id },
          {
            $set: {
              zerodha_settings: {
                enc_token: data.encToken ?? "",
                zerodha_id: data.zerodhaUserId ?? "",
              },
            },
          }
        );

        return user;
      } catch (error) {
        console.log(error);
        throw error;
      }
    }),
  zerodhaSettings: privateProcedure.query(async (opts) => {
    const { user } = opts.ctx;
    return (
      user.zerodha_settings || {
        enc_token: "",
        zerodha_id: "",
      }
    );
  }),
});
