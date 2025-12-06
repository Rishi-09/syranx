import Bytez from "bytez.js"

const key = process.env.BYTEZ
const sdk = new Bytez(key)

const model = sdk.model("stabilityai/stable-diffusion-xl-base-1.0")

const { error, output } = await model.run("A cat in a wizard hat")

console.log({ error, output });