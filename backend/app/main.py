from fastapi.staticfiles import StaticFiles
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.logging import setup_logging
from app.api.router import router as api_router
from app.api.websocket_handler import ws_router
from app.api.auth import router as auth_router

# Initialise logging before anything else
setup_logging()

app = FastAPI(title=settings.PROJECT_NAME)
app.mount("/storage", StaticFiles(directory="storage"), name="storage")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR, tags=["video-processing"])
app.include_router(auth_router, prefix=f"{settings.API_V1_STR}/auth", tags=["authentication"])
app.include_router(ws_router, tags=["real-time-streams"])
@app.get("/")
async def root():
    return {"service": settings.PROJECT_NAME, "status": "online"}
