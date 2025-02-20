from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Dict
from datetime import datetime
import uuid
import re
import base64
import databutton as db
import google.generativeai as genai
import json

router = APIRouter()

# Configure Gemini
genai.configure(api_key=db.secrets.get("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-1.5-flash')

class AnalysisRequest(BaseModel):
    image: str  # base64 encoded image

class StoolAnalysis(BaseModel):
    color: str = Field(description="Color of the stool")
    consistency: str = Field(description="Consistency of the stool (e.g., soft, hard, loose)")
    shape: str = Field(description="Shape of the stool according to Bristol Stool Scale")
    health_score: int = Field(description="Overall health score from 1-10")
    concerns: List[str] = Field(description="List of potential health concerns identified")
    recommendations: List[str] = Field(description="List of recommendations for improvement")

class AnalysisResponse(BaseModel):
    analysis: StoolAnalysis

def sanitize_storage_key(key: str) -> str:
    """Sanitize storage key to only allow alphanumeric and ._- symbols"""
    return re.sub(r'[^a-zA-Z0-9._-]', '', key)

def get_history_storage_key() -> str:
    """Get the storage key for history data"""
    return sanitize_storage_key("stool_analysis_history")



def save_analysis_result(analysis: StoolAnalysis) -> None:
    """Save analysis result to history"""
    try:
        # Create history entry
        entry = {
            "id": str(uuid.uuid4()),
            "date": datetime.utcnow().isoformat(),
            "analysis": analysis.dict()
        }
        
        # Get existing history
        history_key = get_history_storage_key()
        history = db.storage.json.get(history_key, default=[])
        
        # Add new entry
        history.append(entry)
        
        # Save updated history
        db.storage.json.put(history_key, history)
    
    except Exception as e:
        print(f"Error saving analysis result: {str(e)}")
        # Don't raise exception to avoid breaking the analysis flow

@router.post("/analyze-stool")
def analyze_stool(request: AnalysisRequest) -> AnalysisResponse:
    try:
        # Prepare image data
        image_data = request.image.split(",")[1] if "," in request.image else request.image
        
        # Create image part for Gemini
        image_parts = [
            {
                "mime_type": "image/jpeg",
                "data": base64.b64decode(image_data)
            }
        ]

        # Prepare prompt
        prompt = """
        Here's an analysis of the stool image, remembering that I am an AI and this is not a substitute for professional medical advice:

        1. Color: Describe the color in detail, including any variations or patterns.

        2. Consistency: Describe the consistency in detail, noting whether it's soft, hard, loose, or has other characteristics.

        3. Shape: Classify according to the Bristol Stool Scale, providing detailed observations about the shape and form.

        4. Health Score: Rate from 1-10, expressing it as X/10, and explain the reasoning for this score.

        5. Concerns: List and explain any potential health concerns or issues that should be monitored.

        6. Recommendations: Provide detailed recommendations for improving stool health and when to seek medical attention.

        Be specific and medical in your analysis. Include a disclaimer about seeking professional medical advice.
        """

        print("Sending request to Gemini...")
        # Generate content with Gemini
        response = model.generate_content([prompt, image_parts[0]])
        
        # Log raw response for debugging
        print("Raw Gemini response:")
        print(response.text)
        response_text = response.text

        # Parse the response into our structure
        lines = response_text.strip().split('\n')
        parsed_response = {
            'color': 'Unknown',
            'consistency': 'Unknown',
            'shape': 'Unknown',
            'health_score': 5,
            'concerns': [],
            'recommendations': []
        }
        current_key = None
        current_list = []

        print("Parsing response...")
        for line in lines:
            line = line.strip()
            if not line:  # Skip empty lines
                continue
                
            print(f"Processing line: {line}")
            
            # Clean any markdown formatting from the line
            line = line.replace('**', '')
            
            # More flexible parsing for numbered items
            if '1.' in line and 'color' in line.lower():
                parsed_response['color'] = line.split(':', 1)[1].strip() if ':' in line else 'Unknown'
            elif '2.' in line and 'consistency' in line.lower():
                parsed_response['consistency'] = line.split(':', 1)[1].strip() if ':' in line else 'Unknown'
            elif '3.' in line and 'shape' in line.lower():
                parsed_response['shape'] = line.split(':', 1)[1].strip() if ':' in line else 'Unknown'
            elif '4.' in line and 'health score' in line.lower():
                if ':' in line:
                    score_text = line.split(':', 1)[1].strip()
                    # Look for X/10 pattern
                    import re
                    score_match = re.search(r'([0-9]+)/10', score_text)
                    if score_match:
                        try:
                            score = int(score_match.group(1))
                            parsed_response['health_score'] = min(max(score, 1), 10)  # Ensure between 1-10
                            print(f"Found health score: {score}/10")
                        except ValueError:
                            print(f"Could not parse health score from match: {score_match.group(1)}")
                    else:
                        # Fallback to looking for any number
                        try:
                            score = int(''.join(filter(str.isdigit, score_text)))
                            parsed_response['health_score'] = min(max(score, 1), 10)  # Ensure between 1-10
                            print(f"Found health score (fallback): {score}")
                        except ValueError:
                            print(f"Could not parse health score from: {score_text}")
            elif '5.' in line and 'concerns' in line.lower():
                current_key = 'concerns'
                current_list = []
            elif '6.' in line and 'recommendations' in line.lower():
                if current_key == 'concerns':
                    parsed_response['concerns'] = current_list
                current_key = 'recommendations'
                current_list = []
            elif (line.startswith('- ') or line.startswith('* ') or line.startswith('**')) and current_key:
                # Remove markdown formatting and clean up the line
                cleaned_line = line.replace('**', '').lstrip('- ').lstrip('* ').strip()
                if cleaned_line:  # Only add non-empty lines
                    current_list.append(cleaned_line)

        if current_key == 'recommendations':
            parsed_response['recommendations'] = current_list

        print("Parsed response:")
        print(json.dumps(parsed_response, indent=2))

        # Create StoolAnalysis instance
        analysis = StoolAnalysis(
            color=parsed_response['color'],
            consistency=parsed_response['consistency'],
            shape=parsed_response['shape'],
            health_score=parsed_response['health_score'],
            concerns=parsed_response['concerns'],
            recommendations=parsed_response['recommendations']
        )
        
        # Validate we got meaningful values
        if analysis.color == 'Unknown' and analysis.consistency == 'Unknown' and analysis.shape == 'Unknown':
            print("Warning: All main fields are 'Unknown'. This might indicate a parsing issue.")
            
        save_analysis_result(analysis)

        return AnalysisResponse(analysis=analysis)

    except ValueError as ve:
        # Proper exception chaining with 'from'
        raise HTTPException(status_code=422, detail=str(ve)) from ve
    except Exception as e:
        print(f"Gemini API Error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to analyze image. Please ensure you have:"
                   "1. Valid Gemini API key\n"
                   "2. Properly formatted base64 encoded image"
        ) from e