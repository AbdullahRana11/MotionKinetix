<p align="center">
  <img src="https://img.shields.io/badge/Python-3.12-3776AB?style=flat-square&logo=python&logoColor=white" />
  <img src="https://img.shields.io/badge/FastAPI-0.111-009688?style=flat-square&logo=fastapi&logoColor=white" />
  <img src="https://img.shields.io/badge/Next.js-14.2-000000?style=flat-square&logo=nextdotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/YOLOv8-Pose-FF6F00?style=flat-square&logo=yolo&logoColor=white" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" />
</p>

# MotionKinetix

**Real-time biomechanical analysis platform for athletic performance.**

MotionKinetix is a full-stack application that processes sports video footage through a YOLOv8 pose estimation pipeline, extracts COCO-format skeletal keypoints frame-by-frame, derives kinematic telemetry (joint angles, angular velocity), and renders an interactive skeleton overlay directly on the video in the browser using the Canvas API. Athletes and coaches upload a video, and the system returns a frame-accurate biomechanical breakdown with a DTW-based similarity score against a reference standard.

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Core Processing Pipeline](#core-processing-pipeline)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Reference](#api-reference)
- [Frontend Routes](#frontend-routes)
- [Testing](#testing)
- [License](#license)

---

## Architecture Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                        CLIENT (Next.js 14)                       │
│                                                                  │
│   Landing ──► Auth ──► Dashboard ──► Upload ──► Analysis Page    │
│                                                    │             │
│                                          ┌─────────┴──────────┐  │
│                                          │  SkeletalPlayer    │  │
│                                          │  (Canvas Overlay)  │  │
│                                          └────────────────────┘  │
└───────────────────────────┬──────────────────────────────────────┘
                            │ REST + WebSocket
┌───────────────────────────┴──────────────────────────────────────┐
│                       SERVER (FastAPI)                            │
│                                                                  │
│   Auth (JWT/OAuth2)                                              │
│   Video Upload ──► Background Worker ──► Pose Engine (YOLOv8)    │
│                                              │                   │
│                                     Physics Engine (Kinematics)  │
│                                              │                   │
│                                     DTW Engine (FastDTW)         │
│                                              │                   │
│                                        SQLite + Alembic          │
└──────────────────────────────────────────────────────────────────┘
```

The system follows a decoupled client-server architecture. The backend handles all compute-intensive operations (pose estimation, kinematic derivation, DTW comparison) while the frontend is responsible for rendering the skeleton overlay and managing session state.

---

## Core Processing Pipeline

### 1. Pose Estimation (`pose_engine.py`)

Video frames are processed sequentially through a **YOLOv8n-pose** model. For each frame, the model outputs 17 COCO-format keypoints (nose, eyes, ears, shoulders, elbows, wrists, hips, knees, ankles) with `(x, y, confidence)` coordinates. These are serialized as `Keypoint` Pydantic models and stored in the database as JSON.

### 2. Kinematic Derivation (`physics_engine.py`)

The `KinematicEngine` class maintains frame-over-frame state to compute:

- **Joint angles** via two-argument arctangent (`np.arctan2`) of the cross product and dot product between limb vectors. This provides numerical stability across all quadrants.
- **EMA smoothing** (α = 0.4) to reduce noise from YOLO predictions without introducing excessive latency.
- **Angular velocity** (°/s) computed as `Δθ / Δt` between consecutive smoothed angles.

### 3. Similarity Scoring (`dtw_engine.py`)

User telemetry is compared against a reference "golden standard" using **Fast Dynamic Time Warping** (FastDTW with Euclidean distance). The raw DTW distance is normalized against a length-scaled threshold to produce a 0–100 similarity score.

### 4. Real-time Skeleton Rendering (`SkeletalPlayer.tsx`)

The frontend `SkeletalPlayer` component overlays an HTML5 `<canvas>` element on top of a `<video>` element. A `requestAnimationFrame` loop continuously:

1. Reads `video.currentTime` and derives the current frame index.
2. Locates the matching skeleton frame from the API response.
3. Scales keypoint coordinates from video resolution to canvas resolution.
4. Draws color-coded bones (COCO skeleton connections) and glowing joint dots using the Canvas 2D API.
5. Renders a live HUD showing frame count, active keypoints, and elapsed time.

---

## Tech Stack

### Backend

| Component | Technology |
|---|---|
| Framework | FastAPI |
| Pose Estimation | Ultralytics YOLOv8n-pose |
| Computer Vision | OpenCV (headless) |
| Kinematic Math | NumPy, SciPy |
| Time Series Comparison | FastDTW, dtw-python |
| Database | SQLite via SQLAlchemy ORM |
| Migrations | Alembic |
| Auth | JWT (PyJWT), bcrypt, OAuth2 password flow |
| Real-time | WebSocket (native FastAPI) |
| Config | Pydantic Settings (`.env` support) |

### Frontend

| Component | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5.4 |
| Styling | Tailwind CSS 3.4 |
| Animation | Framer Motion 11 |
| State Management | Zustand 4.5 |
| Skeleton Rendering | Canvas 2D API |
| Icons | Lucide React |

---

## Project Structure

```
MotionKinetix/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth.py              # JWT registration & login endpoints
│   │   │   ├── router.py            # Video upload, listing, analysis, comparison
│   │   │   └── websocket_handler.py # Real-time telemetry streaming
│   │   ├── core/
│   │   │   ├── config.py            # Pydantic Settings with computed paths
│   │   │   ├── database.py          # SQLAlchemy engine, session, Base
│   │   │   ├── logging.py           # Structured logging setup
│   │   │   └── security.py          # Password hashing, JWT creation/verification
│   │   ├── crud/
│   │   │   ├── telemetry.py         # Bulk insert & query for keypoint data
│   │   │   ├── user.py              # User CRUD operations
│   │   │   └── video.py             # Video record CRUD operations
│   │   ├── models/
│   │   │   ├── telemetry.py         # Telemetry ORM model (JSON keypoints column)
│   │   │   ├── user.py              # User ORM model
│   │   │   └── video.py             # Video ORM model
│   │   ├── schemas/
│   │   │   ├── kinematics.py        # Keypoint, SkeletonFrame, TelemetryMetrics
│   │   │   ├── telemetry.py         # Telemetry response schemas
│   │   │   └── user.py              # UserCreate, UserResponse, Token
│   │   ├── services/
│   │   │   ├── dtw_engine.py        # FastDTW similarity scoring
│   │   │   ├── physics_engine.py    # Joint angle calculation, EMA, angular velocity
│   │   │   ├── pose_engine.py       # YOLOv8 frame-by-frame keypoint extraction
│   │   │   └── worker.py            # Background video processing task
│   │   └── main.py                  # FastAPI app entry point
│   ├── alembic/                     # Database migration scripts
│   ├── storage/                     # Runtime data (uploads, processed cache)
│   ├── requirements.txt
│   └── yolov8n-pose.pt              # Pre-trained pose model weights
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── analysis/[id]/page.tsx   # Dynamic analysis view with skeleton overlay
│   │   │   ├── auth/page.tsx            # Authentication page
│   │   │   ├── dashboard/page.tsx       # Video listing dashboard
│   │   │   ├── dashboard/upload/page.tsx # Video upload form
│   │   │   ├── layout.tsx               # Root layout
│   │   │   └── page.tsx                 # Landing page
│   │   ├── components/
│   │   │   ├── analysis/
│   │   │   │   └── SkeletalPlayer.tsx   # Canvas-based skeleton renderer
│   │   │   ├── auth/
│   │   │   │   └── AuthForm.tsx         # Login/Register form with API integration
│   │   │   ├── layout/
│   │   │   │   └── AuthLayout.tsx       # Split-screen auth layout
│   │   │   └── ui/
│   │   │       ├── HeroSection.tsx      # Landing hero section
│   │   │       └── TopNav.tsx           # Navigation component
│   │   └── store/
│   │       └── useAuthStore.ts          # Zustand JWT session store
│   ├── public/backgrounds/             # Background images
│   ├── package.json
│   ├── tailwind.config.ts
│   └── tsconfig.json
│
└── README.md
```

---

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- Git

### Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv .venv
.venv\Scripts\Activate.ps1        # Windows PowerShell
# source .venv/bin/activate       # macOS / Linux

# Install dependencies
pip install -r requirements.txt

# The YOLOv8 pose model weights (yolov8n-pose.pt) are included in the repo.
# If missing, Ultralytics will auto-download them on first run.

# Run database migrations
alembic upgrade head

# Start the development server
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`. Interactive documentation is at `/docs`.

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at `http://localhost:3000`.

---

## API Reference

All endpoints are prefixed with `/api/v1`.

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/auth/register` | Register a new user account |
| `POST` | `/api/v1/auth/token` | OAuth2 password login, returns JWT |

### Videos

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/videos` | List all uploaded videos |
| `POST` | `/api/v1/videos/upload` | Upload a video file (mp4, mov, avi) |
| `GET` | `/api/v1/videos/{id}/status` | Check processing status of a video |

### Analysis

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/analysis/{id}` | Get full analysis with skeleton keypoints per frame |
| `GET` | `/api/v1/compare/{user_id}/{pro_id}` | DTW comparison between two processed videos |

### WebSocket

| Protocol | Endpoint | Description |
|---|---|---|
| `WS` | `/ws/telemetry/{video_id}` | Real-time frame-by-frame telemetry stream |

---

## Frontend Routes

| Route | Description |
|---|---|
| `/` | Landing page |
| `/auth` | Login / Registration |
| `/dashboard` | Video library with processing status |
| `/dashboard/upload` | Upload new video for analysis |
| `/analysis/[id]` | Side-by-side video comparison with skeleton overlay |

---

## Testing

Backend tests are located in the `backend/` directory:

```bash
cd backend

# Authentication flow
python test_auth.py

# Video upload
python test_upload.py

# End-to-end worker pipeline
python test_worker.py
```

---

## License

This project is licensed under the MIT License.
