import React from 'react'
import NavbarComponent from '../components/navbar'

const PrivacyPolicy = () => {
	return (
		<div>
			<NavbarComponent />

			<main className="mt-16 p-8 bg-gray-100 text-gray-800">
				<h1 className="text-3xl font-bold mb-6">
					Privacy Policy for Our Domotic IoT Product
				</h1>

				<p className="text-sm text-gray-500 mb-2">
					Effective Date: Aug 25th 2024
				</p>

				<section className="mb-6">
					<h2 className="text-xl font-semibold mb-2">
						1. Introduction
					</h2>
					<p>
						This Privacy Policy outlines how we collect, use, and
						safeguard the personal data of users who interact with
						our domotic IoT product. By using our services, you
						agree to the terms described in this policy.
					</p>
				</section>

				<section className="mb-6">
					<h2 className="text-xl font-semibold mb-2">
						2. Data Collection and Usage
					</h2>

					<div className="ml-4">
						<h3 className="text-lg font-semibold mb-1">
							2.1 Image Data
						</h3>
						<p className="mb-4">
							We collect and process images submitted for
							analysis, such as those of solar panels or soil
							conditions. These images are retained for a period
							of 30 days to allow for necessary analysis and
							processing. After this period, the images and
							related data will be permanently deleted from our
							systems.
						</p>

						<h3 className="text-lg font-semibold mb-1">
							2.2 Sensor Data
						</h3>
						<p className="mb-4">
							We collect and store data provided by the sensors
							integrated with our IoT devices, including but not
							limited to humidity and temperature readings. This
							data is essential for the features of our soil
							analysis and panel analysis information systems,
							enabling accurate assessments and recommendations.
						</p>

						<h3 className="text-lg font-semibold mb-1">
							2.3 User Data
						</h3>
						<p className="mb-4">
							When you register for our services, we collect
							personal information, including the product ID,
							email address, and password. This data is used for
							account management and to provide you with access to
							our services.
						</p>
					</div>
				</section>

				<section className="mb-6">
					<h2 className="text-xl font-semibold mb-2">
						3. Data Security
					</h2>

					<div className="ml-4">
						<h3 className="text-lg font-semibold mb-1">
							3.1 Password Protection
						</h3>
						<p className="mb-4">
							Passwords provided during registration are hashed
							using industry-standard encryption methods. These
							hashed passwords are stored in secure environments
							to prevent unauthorized access.
						</p>

						<h3 className="text-lg font-semibold mb-1">
							3.2 Communication Security
						</h3>
						<p className="mb-4">
							All communications between the client, server, and
							IoT devices are encrypted using strong encryption
							protocols. This ensures that data transmitted
							between your devices and our servers is secure and
							protected from unauthorized access.
						</p>
					</div>
				</section>

				<section className="mb-6">
					<h2 className="text-xl font-semibold mb-2">
						4. Data Retention and Deletion
					</h2>

					<div className="ml-4">
						<p className="mb-4">
							We retain your data for as long as necessary to
							provide you with our services. However, you have the
							right to request the deletion of your account and
							all associated data at any time.
						</p>

						<h3 className="text-lg font-semibold mb-1">
							4.1 Requesting Account Deletion
						</h3>
						<p className="mb-4">
							If you wish to delete your account and all related
							data, please contact us at [Insert Contact
							Information]. We will process your request promptly,
							and all your data will be permanently deleted from
							our systems.
						</p>
					</div>
				</section>

				<section className="mb-6">
					<h2 className="text-xl font-semibold mb-2">
						5. Changes to this Privacy Policy
					</h2>
					<p>
						We may update this Privacy Policy from time to time to
						reflect changes in our practices or legal requirements.
						We encourage you to review this policy periodically.
					</p>
				</section>

				<section className="mb-6">
					<h2 className="text-xl font-semibold mb-2">
						6. Contact Us
					</h2>
					<p>
						If you have any questions or concerns about this Privacy
						Policy, please contact us at asterki.tech/contact
					</p>
				</section>
			</main>
		</div>
	)
}

export default PrivacyPolicy
