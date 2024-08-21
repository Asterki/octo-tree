import formidable, { IncomingForm } from 'formidable'

import AzureStorageService from '../../services/azure/storage'
import { v4 as uuidv4 } from 'uuid'

import { NextFunction, Request, Response } from 'express'

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

		console.log(file, currentUser)

		// Save the image
		const imageID = uuidv4()

		const buffer = Buffer.from(file.toString(), 'base64')
		const storage = AzureStorageService.getInstance()
		await storage.createContainer('soil-images')
		await storage.uploadFile(
			'soil-images',
			`${imageID}.jpg`,
			buffer
		)

		return res.status(200).json({
			status: 'success',
			message: 'image-uploaded',
			imageID: imageID,
		})
	} catch (err) {
		console.log(err)
		return res.status(500).send({
			status: 'error',
		})
	}
}

export default handler
