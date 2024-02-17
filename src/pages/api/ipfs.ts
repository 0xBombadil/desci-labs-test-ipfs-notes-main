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
    await retrieveData(req, res)
  } else {
    // Handle any other HTTP method
    res.status(405)
  }
}

const retrieveData = async (req: NextApiRequest, res: NextApiResponse<BasicIpfsData>) => {
  // connect to the default API address http://localhost:5001
  const client = create()
  // call Core API methods
  let cid = req.query.cid
  if (typeof cid !== "string") res.status(400)
  cid = cid as string

  let content: string[] = []
  try {
    for await (const value of client.cat(cid)) {
      content.push(new TextDecoder().decode(value, {}))
    }
    console.log(content)

    const note = JSON.parse(content[0])
    res.status(200).json({ cid, content: note })
  } catch (error) {
    console.error(error)
    res.status(400)
  }
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

  // for await (const value of client.cat(data.cid)) {
  //   console.log(new TextDecoder().decode(value))
  // }

  // const result = client.cat(data.cid)
  // console.log(data)
  // console.log(result)

  res.status(200).json({ cid: data.path, content: note })
}
