"""
models.py
SQLAlchemy / PostgreSQL relational models matching SkillPilot AI architecture.
"""

from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Boolean, DateTime, ForeignKey, Text, Float
)
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # 1:1 relationship with student_profile
    profile = relationship("StudentProfile", back_populates="user", uselist=False)
    attempts = relationship("QuestionAttempt", back_populates="user")
    sessions = relationship("QuizSession", back_populates="user")
    xp_transactions = relationship("XPTransaction", back_populates="user")


class StudentProfile(Base):
    __tablename__ = "student_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    full_name = Column(String(255))
    college = Column(String(255))
    degree = Column(String(100))
    department = Column(String(100))
    graduation_year = Column(String(20))
    target_role = Column(String(100), default="Career Explorer")
    level = Column(Integer, default=1)
    xp = Column(Integer, default=0)
    streak = Column(Integer, default=0)
    energy = Column(Integer, default=10)
    energy_updated_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="profile")


class Question(Base):
    __tablename__ = "questions"

    id = Column(String(50), primary_key=True, index=True)
    category = Column(String(50), index=True, nullable=False)
    topic = Column(String(100), index=True, nullable=False)
    subtopic = Column(String(100))
    type = Column(String(30), default="mcq")
    difficulty = Column(String(20), default="Medium")
    question = Column(Text, nullable=False)
    code_snippet = Column(Text, nullable=True)
    options_json = Column(Text, nullable=False) # JSON encoded options array
    correct_answer = Column(Text, nullable=False)
    why_explanation = Column(Text, nullable=False)
    why_not_others_json = Column(Text, nullable=True) # JSON encoded distractors
    concept = Column(String(100))
    skill = Column(String(100))
    xp_reward = Column(Integer, default=50)


class QuestionAttempt(Base):
    __tablename__ = "question_attempts"

    id = Column(String(100), primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    question_id = Column(String(50), ForeignKey("questions.id"), nullable=False)
    category = Column(String(50), index=True)
    topic = Column(String(100))
    selected_answer = Column(Text)
    is_correct = Column(Boolean, nullable=False)
    time_taken_seconds = Column(Integer, default=15)
    xp_earned = Column(Integer, default=0)
    combo_count = Column(Integer, default=0)
    timestamp = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="attempts")


class QuizSession(Base):
    __tablename__ = "quiz_sessions"

    id = Column(String(100), primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    mode = Column(String(50), default="quick_quiz")
    category = Column(String(50))
    total_questions = Column(Integer, default=5)
    correct_answers = Column(Integer, default=0)
    xp_earned = Column(Integer, default=0)
    max_combo = Column(Integer, default=0)
    score_pct = Column(Float, default=0.0)
    timestamp = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="sessions")


class XPTransaction(Base):
    __tablename__ = "xp_transactions"

    id = Column(String(100), primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    amount = Column(Integer, nullable=False)
    source = Column(String(50))
    reason = Column(String(255))
    timestamp = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="xp_transactions")
