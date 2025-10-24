import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    DATABASE_URL: str = os.getenv("DATABASE_URL")
    FAKE_STORE_API: str = os.getenv("FAKE_STORE_API")
    SYNC_INTERVAL_HOURS: int = int(os.getenv("SYNC_INTERVAL_HOURS", 6))
    FRONTEND_URL: str = os.getenv("FRONTEND_URL")


settings = Settings()
