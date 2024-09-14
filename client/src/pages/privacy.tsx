import * as React from 'react'
import NavbarComponent from '../components/navbar'
import { useTranslation } from 'react-i18next'

const PrivacyPolicy = () => {
	const { t } = useTranslation('common')

	return (
		<div>
			<NavbarComponent />

			<main className="md:mt-16 mt-32 p-8 bg-gray-100 text-gray-800">
				<h1 className="text-3xl font-bold mb-6">{t('privacy.title')}</h1>

				<p className="text-sm text-gray-500 mb-2">
					{t('privacy.effectiveDate')}
				</p>

				<section className="mb-6">
					<h2 className="text-xl font-semibold mb-2">
						{t('privacy.sections.introduction.title')}
					</h2>
					<p>{t('privacy.sections.introduction.content')}</p>
				</section>

				<section className="mb-6">
					<h2 className="text-xl font-semibold mb-2">
						{t('privacy.sections.dataCollectionUsage.title')}
					</h2>

					<div className="ml-4">
						<h3 className="text-lg font-semibold mb-1">
							{t('privacy.sections.dataCollectionUsage.imageData.title')}
						</h3>
						<p className="mb-4">
							{t(
								'sections.dataCollectionUsage.imageData.content'
							)}
						</p>

						<h3 className="text-lg font-semibold mb-1">
							{t('privacy.sections.dataCollectionUsage.sensorData.title')}
						</h3>
						<p className="mb-4">
							{t(
								'sections.dataCollectionUsage.sensorData.content'
							)}
						</p>

						<h3 className="text-lg font-semibold mb-1">
							{t('privacy.sections.dataCollectionUsage.userData.title')}
						</h3>
						<p className="mb-4">
							{t('privacy.sections.dataCollectionUsage.userData.content')}
						</p>
					</div>
				</section>

				<section className="mb-6">
					<h2 className="text-xl font-semibold mb-2">
						{t('privacy.sections.dataSecurity.title')}
					</h2>

					<div className="ml-4">
						<h3 className="text-lg font-semibold mb-1">
							{t(
								'sections.dataSecurity.passwordProtection.title'
							)}
						</h3>
						<p className="mb-4">
							{t(
								'sections.dataSecurity.passwordProtection.content'
							)}
						</p>

						<h3 className="text-lg font-semibold mb-1">
							{t(
								'sections.dataSecurity.communicationSecurity.title'
							)}
						</h3>
						<p className="mb-4">
							{t(
								'sections.dataSecurity.communicationSecurity.content'
							)}
						</p>
					</div>
				</section>

				<section className="mb-6">
					<h2 className="text-xl font-semibold mb-2">
						{t('privacy.sections.dataRetentionDeletion.title')}
					</h2>

					<div className="ml-4">
						<p className="mb-4">
							{t('privacy.sections.dataRetentionDeletion.content')}
						</p>

						<h3 className="text-lg font-semibold mb-1">
							{t(
								'sections.dataRetentionDeletion.requestingAccountDeletion.title'
							)}
						</h3>
						<p className="mb-4">
							{t(
								'sections.dataRetentionDeletion.requestingAccountDeletion.content'
							)}
						</p>
					</div>
				</section>

				<section className="mb-6">
					<h2 className="text-xl font-semibold mb-2">
						{t('privacy.sections.changesToPolicy.title')}
					</h2>
					<p>{t('privacy.sections.changesToPolicy.content')}</p>
				</section>

				<section className="mb-6">
					<h2 className="text-xl font-semibold mb-2">
						{t('privacy.sections.contactUs.title')}
					</h2>
					<p>{t('privacy.sections.contactUs.content')}</p>
				</section>
			</main>
		</div>
	)
}

export default PrivacyPolicy
