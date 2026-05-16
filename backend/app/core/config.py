from pathlib import Path
from pydantic import computed_field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "Apex-Kinematics Engine"
    API_V1_STR: str = "/api/v1"
    DEBUG_MODE: bool = True
    STORAGE_BASE_DIR: str = "storage"

    # Configure Pydantic to read from environment variables or a .env file
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )

    @computed_field
    def STORAGE_PATH(self) -> Path:
        """Resolve the absolute path to the base storage directory.
        
        This dynamically resolves relative to the backend application root.
        """
        backend_dir = Path(__file__).resolve().parents[2]
        path = (backend_dir / self.STORAGE_BASE_DIR).resolve()
        path.mkdir(parents=True, exist_ok=True)
        return path

    @computed_field
    def UPLOADS_DIR(self) -> Path:
        """Resolve and guarantee the absolute path for the 'uploads' directory."""
        path = self.STORAGE_PATH / "uploads"
        path.mkdir(parents=True, exist_ok=True)
        return path

    @computed_field
    def PROCESSED_CACHE_DIR(self) -> Path:
        """Resolve and guarantee the absolute path for the 'processed_cache' directory."""
        path = self.STORAGE_PATH / "processed_cache"
        path.mkdir(parents=True, exist_ok=True)
        return path

    @computed_field
    def GOLDEN_STANDARDS_DIR(self) -> Path:
        """Resolve and guarantee the absolute path for the 'golden_standards' directory."""
        path = self.STORAGE_PATH / "golden_standards"
        path.mkdir(parents=True, exist_ok=True)
        return path


# Global settings instantiation
settings = Settings()
