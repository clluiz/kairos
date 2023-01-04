import closeWithGrace from "close-with-grace";
import { CloseWithGraceCallbackOptions, main } from "./main.js";

declare var process : {
  env: {
    NODE_ENV: string,
    PORT: number,
  }
}

const start = async () => {
  const app = await main({})

  await app.listen({ port: process.env.PORT || 3000 })

  closeWithGrace({ delay: 500 }, async function ({ err }: CloseWithGraceCallbackOptions) {
    if (err) {
      console.error(err)
    }
    await app.close()
  })
}

start()