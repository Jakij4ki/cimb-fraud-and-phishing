from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 480
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    CORS_ORIGINS: list[str] = ["http://localhost:3000"]
    ML_MODEL_PATH: str = "./ml/model"
    ENABLE_ML_MODEL: bool = False
    NLP_FALLBACK_ENABLED: bool = True
    ENVIRONMENT: str = "development"
    ADMIN_DEFAULT_PASSWORD: str = "changeme123"
    MAX_REQUEST_SIZE_MB: int = 1
    RATE_LIMIT_ANALYZE: str = "10/minute"
    RATE_LIMIT_REPORT: str = "5/minute"
    RATE_LIMIT_LOGIN: str = "5/minute"

    class Config:
        env_file = ".env"

settings = Settings()
