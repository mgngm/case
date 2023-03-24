// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { readFileSync } from 'fs';
import path from 'path';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse<Uint8Array>) {
  if (req.method === 'GET') {
    // single file
    let dataFile = 'example.json';

    if (req.query.list) {
      // list of files
      dataFile = 'example-list.json';
    }

    const filePath = path.resolve(`mock/data/${dataFile}`);

    // read & send file buffer
    const buffer = readFileSync(filePath);
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(buffer);
  }
}
