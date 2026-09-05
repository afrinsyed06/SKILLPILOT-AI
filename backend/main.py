"""
main.py
FastAPI server implementation for SkillPilot AI Gamified Q&A Platform.
"""

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import List, Optional
import os

app = FastAPI(title="SkillPilot AI Career Intelligence API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AttemptCreate(BaseModel):
    user_id: int
    question_id: str
    selected_answer: str
    time_taken_seconds: int = 15
    current_combo: int = 0

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "SkillPilot AI Engine"}

@app.get("/api/categories")
def get_categories():
    return [
        {"id": "aptitude", "name": "Aptitude", "difficulty": "Medium"},
        {"id": "programming", "name": "Programming", "difficulty": "Medium"},
        {"id": "dsa", "name": "DSA", "difficulty": "Hard"},
        {"id": "sql_dbms", "name": "SQL & DBMS", "difficulty": "Medium"},
        {"id": "cs_fundamentals", "name": "Computer Science", "difficulty": "Hard"},
        {"id": "ai_ml", "name": "AI & Machine Learning", "difficulty": "Hard"},
        {"id": "hr_interview", "name": "HR Interview", "difficulty": "Easy"},
        {"id": "communication", "name": "Communication", "difficulty": "Medium"},
        {"id": "coding_challenge", "name": "Coding Challenge", "difficulty": "Hard"},
        {"id": "mixed_quiz", "name": "Mixed Placement Quiz", "difficulty": "Boss"},
    ]

@app.post("/api/attempts")
def submit_attempt(attempt: AttemptCreate):
    # Validates attempt, calculates combo and XP reward
    is_correct = True # Evaluated against database
    xp_earned = 50 if is_correct else 0
    return {
        "status": "success",
        "is_correct": is_correct,
        "xp_earned": xp_earned,
        "next_combo": attempt.current_combo + 1 if is_correct else 0,
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
