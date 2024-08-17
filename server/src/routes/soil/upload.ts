import formidable, { IncomingForm } from 'formidable'
import path from 'path'
import fs from 'fs'
import sharp from 'sharp'
import { v4 as uuidv4 } from 'uuid'

import UploadService from '../../services/upload'
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

		if (!data.files.profile)
			return res.status(400).json({ message: 'bad-request' })
		let file = data.files.profile[0]

		// Create the user directory if it doesn't exist
		await UploadService.getInstance().createDirectory(
			path.join(__dirname, '/uploads/soil/', currentUser.userID)
		)

		// Save the image
		const imageID = uuidv4()
		let newPath = path.join(
			__dirname,
			'/uploads/soil/',
			currentUser.userID,
			imageID
		)
		let rawData = fs.readFileSync(file.filepath)

		// Compress the file
		await sharp(rawData)
			.resize(256, 256)
			.png()
			.toBuffer()
			.then((data) => {
				rawData = data
			})

		fs.writeFile(newPath, rawData, function (err) {
			if (err) console.log(err)
		})

        return res.status(200).json({
            status: 'success',
            message: 'image-uploaded',
            imageID: imageID,
        })
	} catch (err) {
		return res.status(500).send({
			status: 'error',
		})
	}
}

export default handler
