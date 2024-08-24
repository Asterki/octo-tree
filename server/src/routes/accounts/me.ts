import { NextFunction, Request, Response } from 'express'
import { rateLimit } from 'express-rate-limit'

const limiter = rateLimit({
	windowMs: 60 * 1000, // 1 minute
	max: 100, // limit each IP to 100 requests per windowMs
})

const handler = async (req: Request, res: Response, next: NextFunction) => {
	const user = req.user
	if (!user)
		return res.status(401).send({
			status: 'unauthenticated',
		})

	return res.status(200).send({
		status: 'success',
		user: user as any,
	})
}

export { limiter }
export default handler
