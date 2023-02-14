import closeWithGrace from "close-with-grace";
import { create } from "./app.js";
import { CloseWithGraceCallbackOptions } from "./types/closeWithGraceCallBackOptins.js";

declare var process : {
  env: {
    NODE_ENV: string,
    PORT: number,
  }
}

const start = async () => {
  const app = await create({})

  await app.listen({ port: process.env.PORT || 3000 })

  closeWithGrace({ delay: 500 }, async function ({ err }: CloseWithGraceCallbackOptions) {
    if (err) {
      console.error(err)
    }
    await app.close()
  })
}

start()