from fastapi import FastAPI
from contextlib import asynccontextmanager
from app.api.routes import carts, sync
from app.infrastructure.database.connection import init_db, get_db
from app.infrastructure.external.fakestore_service import FakeStoreService
from app.infrastructure.repositories.cart_repository_sqlmodel import (
    CartRepositorySQLModel,
)
from apscheduler.schedulers.background import BackgroundScheduler
import atexit
from app.core.config import settings

scheduler = BackgroundScheduler()


def periodic_sync():
    """Automatically synchronizes data with the Fake Store API."""
    with next(get_db()) as db:
        service = FakeStoreService()
        repository = CartRepositorySQLModel(db)
        carts = service.fetch_carts()
        repository.upsert_many(carts)
        print("Data automatically synchronized with the Fake Store API.")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Executes tasks during the application's lifecycle."""
    print("Initializing database...")
    init_db()

    print("Performing initial data synchronization...")
    periodic_sync()

    print("Starting scheduler...")
    scheduler.add_job(periodic_sync, "interval", hours=settings.SYNC_INTERVAL_HOURS)
    scheduler.start()
    atexit.register(lambda: scheduler.shutdown())

    # Everything is ready — hand over control to the application
    yield

    # On application shutdown:
    print("Shutting down application...")
    scheduler.shutdown()


app = FastAPI(title="Automax API", lifespan=lifespan)

# Routes
app.include_router(carts.router)
app.include_router(sync.router)
