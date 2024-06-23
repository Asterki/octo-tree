from azure.cognitiveservices.vision.computervision import ComputerVisionClient
from msrest.authentication import CognitiveServicesCredentials

import os

endpoint = os.environ.get('SOIL_ENDPOINT')
key = os.environ.get('SOIL_KEY')
region = os.environ.get('SOIL_REGION')

credentials = CognitiveServicesCredentials(key)
client = ComputerVisionClient(endpoint, credentials)

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
        return self.client.analyze_image(image_url, ["Description", "Tags", "Objects", "Color", "Adult"])
    