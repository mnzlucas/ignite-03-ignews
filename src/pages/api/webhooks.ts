import { NextApiRequest, NextApiResponse } from 'next';
const webhook = (req: NextApiRequest, res: NextApiResponse) => {
  console.log('evento recebido')
  res.status(200).json({ok: true})
}
export default webhook;