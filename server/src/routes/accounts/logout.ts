import { NextFunction, Request, Response } from 'express'
import { rateLimit } from 'express-rate-limit'

const limiter = rateLimit({
	windowMs: 60 * 1000, // 1 minute
	max: 1, // limit each IP to 1 requests per windowMs
})

const handler = async (req: Request, res: Response, next: NextFunction) => {
	const user = req.user
	if (!user)
		return res.status(401).send({
			status: 'unauthenticated',
		})

	req.logOut({ keepSessionInfo: false }, (err) => {
		if (err) return next(err)
		return res.send({
			status: 'success',
		})
	})
}

export { limiter }
export default handler
