from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

from app.application.services.cart_service import CartService
from app.infrastructure.repositories.cart_repository_sqlmodel import (
    CartRepositorySQLModel,
)
from app.infrastructure.database.connection import get_db
from app.infrastructure.external.fakestore_service import FakeStoreService

router = APIRouter(prefix="/sync", tags=["Sync"])


@router.post(
    "/",
    status_code=status.HTTP_200_OK,
    summary="Synchronize carts",
    description="Synchronizes carts from the Fake Store API with the local database.",
)
def sync_carts(db: Session = Depends(get_db)):
    """
    Synchronizes carts from the external Fake Store API and updates the local database.
    """

    try:
        # Initialize repository, domain service, and external data source
        repository = CartRepositorySQLModel(db)
        service = CartService(repository)
        external_service = FakeStoreService()

        # Fetch carts from the external API
        carts = external_service.fetch_carts()

        # Validate response
        if not carts:
            raise HTTPException(
                status_code=status.HTTP_204_NO_CONTENT,
                detail="No carts found in the external API.",
            )

        # Insert or update carts in the local database
        service.upsert_many(carts)

        return {"message": f"{len(carts)} carts synchronized successfully."}

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Synchronization failed: {str(e)}",
        )
