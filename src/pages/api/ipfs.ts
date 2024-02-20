// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next"

import { create } from "ipfs-http-client"

// arbitrary response format
export type BasicIpfsData = {
  cid: string
  content: {
    title: string
    text: string
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<BasicIpfsData>) {
  if (req.method === "POST") {
    // Process a POST request
    await addData(req, res)
  } else if (req.method === "GET") {
    // Process a GET request
    console.log("GET")
    await retrieveData(req, res)
    console.log("GET ended")
  } else {
    // Handle any other HTTP method
    res.status(405).end()
  }
}

const retrieveData = async (req: NextApiRequest, res: NextApiResponse<BasicIpfsData>) => {
  // connect to the default API address http://localhost:5001
  // call Core API methods
  let cid = req.query.cid
  if (typeof cid !== "string") res.status(400)
  cid = cid as string
  // console.log({ exists })
  // let content: string[] = []
  try {
    console.log("retreiving data")
    // client.refs.local
    // const values = client.cat(cid, { timeout: 3000 })~
    // abortController.
    // const abortSignal = new AbortSignal()
    // abortSignal.onabort = ev => {
    //   res.status(404)
    // }

    const value = await fetchIPFS(cid)

    console.log(value)

    // const value = (await (asyncIterable as any).next()).catch(() => {
    // res.status(404)
    // })
    // console.log([value])

    if (!value) {
      console.log(value, "is null")
      res.status(404).end()
    } else {
      res.status(200).json(JSON.parse(value))
    }
  } catch (error) {
    console.error(error)
    res.status(400)
  }
}

async function fetchIPFS(cid: string) {
  const client = create()
  const asyncIterable = client.cat(cid, { timeout: 1000 })
  // asyncIterable.throw(e => console.log(e))
  let value
  for await (const n of asyncIterable) {
    console.log(n)
    value = new TextDecoder().decode(n)
    break
  }
  return value
}

const addData = async (req: NextApiRequest, res: NextApiResponse<BasicIpfsData>) => {
  // connect to the default API address http://localhost:5001
  const client = create()
  // call Core API methods
  const note = req.body.note as {
    title: string
    text: string
  }
  const entry = JSON.stringify(note)
  console.log(entry)
  const data = await client.add(entry)

  res.status(200).json({ cid: data.path, content: note })
}
