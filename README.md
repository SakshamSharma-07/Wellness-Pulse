# Wellness Pulse 🧠💚

> **AI-powered mental health estimation model** | Predictive ML + Full-Stack Web Application

[![Python](https://img.shields.io/badge/Python-3.8+-3776ab?style=flat&logo=python)](https://www.python.org/)
[![scikit-learn](https://img.shields.io/badge/scikit--learn-1.0+-F7931E?style=flat&logo=scikit-learn)](https://scikit-learn.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.95+-009688?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Jupyter](https://img.shields.io/badge/Jupyter-Notebook-F37726?style=flat&logo=jupyter)](https://jupyter.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 📋 Executive Summary

A **predictive machine learning application** that estimates student mental health scores (0-10 scale) using behavioral and lifestyle features. The project combines:

- **Data Science**: EDA, feature engineering, model training & validation
- **ML Engineering**: Model serialization (joblib), pipeline optimization
- **Full-Stack Development**: FastAPI backend + Interactive HTML/CSS/JS frontend
- **Product Design**: User-centric interface for health insights

**Dataset**: 4,998 unique student records | **Features**: 13 behavioral & lifestyle variables | **Architecture**: Production-ready ML pipeline

---

## 🎯 Problem Statement

Students face increasing mental health challenges driven by:
- Excessive social media consumption (avg. 5+ hours/day)
- Sleep deprivation and stress overload
- Reduced physical activity
- Poor academic-life balance

**Gap**: Lack of accessible, data-driven self-assessment tools for early mental health awareness.

**Solution**: A predictive ML model that translates behavioral inputs into actionable mental wellness insights.

---

## 🚀 Key Features

### Machine Learning Components
✅ **Multivariate Regression/Classification Model** trained on behavioral data  
✅ **Feature Engineering**: 13 input features spanning demographics, digital habits, and lifestyle  
✅ **Exploratory Data Analysis**: Correlation analysis, distribution patterns, stress-health relationships  
✅ **Data Cleaning Pipeline**: Duplicate removal, null value handling (0 missing values)  
✅ **Model Serialization**: Joblib-based model persistence for production deployment  
✅ **Predictive Pipeline**: End-to-end inference from raw inputs to mental health score  

### Product Features
✅ **Interactive Web Interface**: Step-by-step questionnaire with real-time feedback  
✅ **Responsive Design**: Mobile-friendly, modern UI/UX with CSS3 animations  
✅ **Visual Analytics**: Dial gauge displaying mental wellness score with interpretive bands  
✅ **Instant Predictions**: Sub-second model inference on user input  
✅ **Data-Driven Insights**: Result interpretation based on predictive modeling  

---

## 📊 Dataset & Model Architecture

### Input Features (13 variables)

| Category | Features |
|----------|----------|
| **Demographics** | Age (18-24), Gender (M/F), Country, Academic Level (HS/UG/Grad) |
| **Digital Habits** | Most Used Platform (FB/IG/Snapchat/Twitter/YT/TikTok/LinkedIn etc.), Purpose of Use (Networking/Education/Entertainment/News) |
| **Usage Metrics** | Avg Daily Usage Hours (1-8.8h), Daily Unlocks (62-273) |
| **Lifestyle** | Study Hours (0.3-8.3h), Physical Activity Hours (-0.4-4.1h), Sleep Hours Per Night (3.6-9.9h) |
| **Psychometric** | Stress Level (Low/Medium/High/Very High) |

### Target Variable
- **Mental Health Score**: Continuous (3.6 - 9.4 scale, mean=6.23, std=1.28)

### Dataset Statistics
