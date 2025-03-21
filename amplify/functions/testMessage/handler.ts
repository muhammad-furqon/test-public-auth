import type { Schema } from "../../data/resource"

//Public test message function
export const handler: Schema["testMessage"]["functionHandler"] = async (event) => {
  // arguments typed from `.arguments()`
  const { name } = event.arguments
  // return typed from `.returns()`
  return `Hello, ${name}!`
}