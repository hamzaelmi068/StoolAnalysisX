from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional
import databutton as db
from datetime import datetime
import json
import re

router = APIRouter()

class HealthMetric(BaseModel):
    name: str
    value: str
    severity: str
    description: str
    category: str

class HistoryEntry(BaseModel):
    id: str
    date: str
    metrics: List[HealthMetric]
    recommendations: List[str]

class HistoryResponse(BaseModel):
    entries: List[HistoryEntry]

def sanitize_storage_key(key: str) -> str:
    """Sanitize storage key to only allow alphanumeric and ._- symbols"""
    return re.sub(r'[^a-zA-Z0-9._-]', '', key)

def get_history_storage_key() -> str:
    """Get the storage key for history data"""
    return sanitize_storage_key("stool_analysis_history")

@router.get("/history")
def get_history(
    start_date: Optional[str] = Query(None, description="Start date in ISO format"),
    end_date: Optional[str] = Query(None, description="End date in ISO format")
) -> HistoryResponse:
    try:
        # Get history from storage
        history_key = get_history_storage_key()
        history = db.storage.json.get(history_key, default=[])
        
        # Filter by date if provided
        if start_date or end_date:
            filtered_history = []
            start = datetime.fromisoformat(start_date) if start_date else None
            end = datetime.fromisoformat(end_date) if end_date else None
            
            for entry in history:
                entry_date = datetime.fromisoformat(entry['date'])
                if start and entry_date < start:
                    continue
                if end and entry_date > end:
                    continue
                filtered_history.append(entry)
            history = filtered_history
        
        # Sort by date descending
        history.sort(key=lambda x: x['date'], reverse=True)
        
        return HistoryResponse(entries=history)
    
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=f"Invalid date format: {str(ve)}")
    except Exception as e:
        print(f"Error fetching history: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to fetch history. Please try again or contact support if the issue persists."
        )
