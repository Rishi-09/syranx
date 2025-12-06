import Bytez from "bytez.js"

const key = process.env.BYTEZ
const sdk = new Bytez(key)

// choose Qwen3-0.6B
const model = sdk.model("Qwen/Qwen3-0.6B")

// send input to model
const { error, output } = await model.run([
  {
    "role": "user",
    "content": "Hello"
  }
])

console.log({ error, output });