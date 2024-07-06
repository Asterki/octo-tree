from azure.ai.vision.imageanalysis import ImageAnalysisClient
from azure.ai.vision.imageanalysis.models import VisualFeatures
from azure.core.credentials import AzureKeyCredential
from dotenv import dotenv_values

config = dotenv_values(".env")

endpoint = config["SOIL_ENDPOINT"]
key = config["SOIL_KEY"]
region = config["SOIL_REGION"]

client = ImageAnalysisClient(endpoint, AzureKeyCredential(key))

class SoilService:
    _instance = None

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = SoilService()
        return cls._instance

    def __init__(self):
        self.client = client

    def get_soil(self, image_url):
        visual_features = [
            VisualFeatures.TAGS,
        ]
        return self.client.analyze_from_url(image_url, visual_features=visual_features)
