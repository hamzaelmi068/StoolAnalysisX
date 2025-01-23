from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
import base64
import databutton as db
from openai import OpenAI
import json

router = APIRouter()

class AnalysisRequest(BaseModel):
    image: str  # base64 encoded image

class HealthMetric(BaseModel):
    name: str
    value: str
    severity: str  # 'normal', 'mild', 'moderate', 'severe'
    description: str
    category: str  # 'appearance', 'composition', 'consistency'

class AnalysisResponse(BaseModel):
    metrics: List[HealthMetric]
    recommendations: List[str]

def parse_analysis_response(content: str) -> tuple[List[HealthMetric], List[str]]:
    """Parse the OpenAI response into metrics and recommendations."""
    try:
        # Extract metrics section
        metrics_start = content.find("METRICS:")
        recommendations_start = content.find("RECOMMENDATIONS:")
        
        if metrics_start == -1 or recommendations_start == -1:
            raise ValueError("Response format not recognized")
        
        metrics_text = content[metrics_start:recommendations_start].strip()
        recommendations_text = content[recommendations_start:].strip()
        
        # Parse metrics
        metrics = []
        metric_lines = metrics_text.split("\n")[1:] # Skip "METRICS:" line
        for line in metric_lines:
            if not line.strip():
                continue
            parts = line.split(":", 2)
            if len(parts) >= 2:
                name = parts[0].strip()
                value_desc = parts[1].split("-")
                if len(value_desc) >= 3:
                    value = value_desc[0].strip()
                    description = value_desc[1].strip()
                    category = value_desc[2].strip()
                    
                    # Map the value to a severity
                    severity = value.lower()
                    if severity not in ["normal", "mild", "moderate", "severe"]:
                        severity = "normal" if severity == "normal" else "moderate"
                    
                    metrics.append(HealthMetric(
                        name=name,
                        value=value,
                        severity=severity,
                        description=description,
                        category=category
                    ))
        
        # Parse recommendations
        recommendations = []
            rec_lines = recommendations_text.split("\n")[1:] # Skip "RECOMMENDATIONS:" line
        for line in rec_lines:
            line = line.strip()
            if line and not line.startswith("RECOMMENDATIONS:"):
                # Remove leading numbers or bullets
                cleaned_line = line.lstrip("0123456789.- ").strip()
                if cleaned_line:
                    recommendations.append(cleaned_line)
        
        return metrics, recommendations
    except Exception as e:
        raise ValueError(f"Failed to parse analysis response: {str(e)}")

@router.post("/analyze-stool")
def analyze_stool(request: AnalysisRequest) -> AnalysisResponse:
    try:
        # Initialize OpenAI client
        client = OpenAI(api_key=db.secrets.get("OPENAI_API_KEY"))
        
        # Prepare the image for OpenAI
        image_data = request.image.split(",")[1] if "," in request.image else request.image
        
        # Analyze the image using GPT-4 Vision
        response = client.chat.completions.create(
            model="gpt-4-vision-preview",
            messages=[
                {
                    "role": "system",
                    "content": """You are a medical professional specialized in analyzing stool samples.
                    Analyze the provided stool image and return your analysis in the following format:

                    METRICS:
                    // Appearance
                    Color: [Normal/Mild/Moderate/Severe] - [Description of what this indicates] - appearance
                    Shape: [Normal/Mild/Moderate/Severe] - [Description of what this indicates] - appearance
                    Size: [Normal/Mild/Moderate/Severe] - [Description of what this indicates] - appearance
                    
                    // Composition
                    Mucus: [Normal/Mild/Moderate/Severe] - [Description of what this indicates] - composition
                    Blood: [Normal/Mild/Moderate/Severe] - [Description of what this indicates] - composition
                    
                    // Consistency
                    Texture: [Normal/Mild/Moderate/Severe] - [Description of what this indicates] - consistency
                    Firmness: [Normal/Mild/Moderate/Severe] - [Description of what this indicates] - consistency

                    RECOMMENDATIONS:
                    1. [First specific recommendation based on the analysis]
                    2. [Second specific recommendation]
                                3. [Third specific recommendation]

                    Be professional but approachable in your analysis. Focus on actionable insights."""
                },
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": "Please analyze this stool sample and provide the metrics and recommendations in the specified format."
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{image_data}"
                            }
                        }
                    ]
                }
            ],
            max_tokens=1000
        )
        
        # Process the response
        analysis = response.choices[0].message.content
        if not analysis:
            raise ValueError("No analysis received from OpenAI")
            
        # Parse the response into metrics and recommendations
        metrics, recommendations = parse_analysis_response(analysis)
        
        if not metrics or not recommendations:
            raise ValueError("Failed to extract metrics or recommendations from analysis")
        
        return AnalysisResponse(metrics=metrics, recommendations=recommendations)
        
    except ValueError as ve:
        raise HTTPException(status_code=422, detail=str(ve))
    except Exception as e:
        print(f"Error during analysis: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to analyze the image. Please try again or contact support if the issue persists."
        )