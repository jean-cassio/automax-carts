from fastapi import APIRouter, Depends, Query, HTTPException, status
from typing import List, Optional
from datetime import date
from sqlmodel import Session

from app.infrastructure.database.connection import get_db
from app.infrastructure.repositories.cart_repository_sqlmodel import (
    CartRepositorySQLModel,
)
from app.application.services.cart_service import CartService
from app.domain.entities.cart import Cart

router = APIRouter(prefix="/carts", tags=["Carts"])


@router.get(
    "/",
    response_model=List[Cart],
    status_code=status.HTTP_200_OK,
    summary="Get all carts",
    description="Retrieves all carts stored locally, with optional filters for user ID and date range.",
)
def get_all_carts(
    user_id: Optional[int] = Query(None, description="Filter by user ID"),
    start_date: Optional[date] = Query(
        None, description="Filter by start date (YYYY-MM-DD)"
    ),
    end_date: Optional[date] = Query(
        None, description="Filter by end date (YYYY-MM-DD)"
    ),
    db: Session = Depends(get_db),
):
    """
    Fetch all carts with optional filters for user ID and date range.
    Returns 404 if no carts match the criteria.
    """
    try:
        repository = CartRepositorySQLModel(db)
        service = CartService(repository)

        carts = service.get_all(
            user_id=user_id, start_date=start_date, end_date=end_date
        )

        if not carts:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No carts found matching the given filters.",
            )

        return carts

    except HTTPException:
        # Re-raise intentional HTTP exceptions (e.g., 404)
        raise
    except Exception as e:
        # Handle unexpected errors (database, logic, etc.)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve carts: {str(e)}",
        )


@router.get(
    "/{cart_id}",
    response_model=Cart,
    status_code=status.HTTP_200_OK,
    summary="Get cart by ID",
    description="Fetch a specific cart by its unique ID.",
)
def get_cart(cart_id: int, db: Session = Depends(get_db)):
    """
    Retrieve a single cart by its ID.
    Returns 404 if the cart does not exist.
    """
    try:
        repository = CartRepositorySQLModel(db)
        service = CartService(repository)

        cart = service.get_by_id(cart_id)

        if not cart:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Cart with id {cart_id} not found.",
            )

        return cart

    except HTTPException:
        # Re-raise intentional HTTP exceptions (e.g., 404)
        raise
    except Exception as e:
        # Handle unexpected errors (database, logic, etc.)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve cart: {str(e)}",
        )
