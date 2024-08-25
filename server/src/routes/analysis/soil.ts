import formidable, { IncomingForm } from 'formidable'
import fs from 'fs'
import sharp from 'sharp'

import { rateLimit } from 'express-rate-limit'
import { RedisStore } from 'rate-limit-redis'
import RedisClient from '../../services/redis'

import AzureStorageService from '../../services/azure/storage'
import SoilAnalysisService from '../../services/azure/soil_analysis'
import { v4 as uuidv4 } from 'uuid'

import { NextFunction, Request, Response } from 'express'

const limiter = rateLimit({
	windowMs: 60 * 1000, // 1 minute
	max: 100, // limit each IP to 5 requests per windowMs
	store: new RedisStore({
		sendCommand: async (...args: string[]) =>
			(await RedisClient.getInstance())
				.getClient()
				.sendCommand([...args]),
	}),
	skipFailedRequests: true,
})

const handler = async (req: Request, res: Response, next: NextFunction) => {
	const user = req.user
	if (!user)
		return res.status(401).send({
			status: 'unauthenticated',
		})

	const currentUser = user as any

	try {
		const data: { files: formidable.Files; fields: formidable.Fields } =
			await new Promise((resolve, reject) => {
				const form = new IncomingForm()
				form.parse(req, (err, fields, files) => {
					// TODO: Add filter to only allow images
					if (err) return reject(err)

					resolve({ fields, files })
				})
			})

		if (!data.files.soilimage)
			return res.status(400).json({ message: 'bad-request' })
		let file = data.files.soilimage[0]

		// Check if the filename is on the cache
		const cache = (await RedisClient.getInstance()).getClient()
		const cached = await cache.get(
			(file.originalFilename as string) + currentUser.id
		)

		if (cached) {
			const data = JSON.parse(cached)

			return res.status(200).json({
				status: 'success',
				message: 'image-uploaded',
				analysis: data.analysis,
				url: data.url,
				imageID: data.imageID,
			})
		}

		// File buffer
		let rawData = fs.readFileSync(file.filepath)
		const imageID = uuidv4()

		// Resize the image
		await sharp(rawData)
			.resize(256, 256)
			.png()
			.toBuffer()
			.then((data) => {
				rawData = data
			})

		const buffer = Buffer.from(file.toString(), 'base64')
		const storage = AzureStorageService.getInstance()
		await storage.createContainer('soil-images')
		const url = await storage.uploadFile(
			'soil-images',
			`${imageID}.png`,
			rawData
		)

		// Analyze the image
		const analysis = SoilAnalysisService.getInstance()
		const result = await analysis.analyzeImage(url)

		// Save the analysis to the cache
		await cache.set(
			(file.originalFilename as string) + currentUser.id + 'soil',
			JSON.stringify({
				analysis: result,
				url: url,
				imageID: imageID,
			})
		)

		return res.status(200).json({
			status: 'success',
			message: 'image-uploaded',
			imageID: imageID,
			analysis: result,
			url: url,
		})
	} catch (err) {
		console.log(err)
		return res.status(500).send({
			status: 'error',
		})
	}
}

export { limiter }
export default handler
