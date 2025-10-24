from typing import List, Optional
from sqlalchemy import func
from datetime import date, datetime, time
from sqlmodel import select, Session
from app.domain.entities.cart import Cart, CartItem
from app.domain.repositories.cart_repository_interface import ICartRepository
from app.infrastructure.database.models import Cart as DBCart, CartItem as DBCartItem


class CartRepositorySQLModel(ICartRepository):
    """Repository responsible for database operations on carts using SQLModel."""

    def __init__(self, session: Session):
        self.session = session

    def get_all(
        self,
        user_id: Optional[int] = None,
        start_date: Optional[date] = None,
        end_date: Optional[date] = None,
    ) -> List[Cart]:
        """Retrieve all carts with optional filters."""
        query = select(DBCart)

        if user_id:
            query = query.where(DBCart.user_id == user_id)
        if start_date:
            # Convert start_date (date) to datetime at midnight.
            start_datetime = datetime.combine(start_date, time.min)
            query = query.where(DBCart.date >= start_datetime)

        if end_date:
            # Convert end_date (date) to datetime at the end of the day.
            end_datetime = datetime.combine(end_date, time.max)
            query = query.where(DBCart.date <= end_datetime)

        carts = self.session.exec(query).all()

        return [
            Cart(
                id=c.id,
                user_id=c.user_id,
                date=c.date,
                items=[
                    CartItem(product_id=i.product_id, quantity=i.quantity)
                    for i in c.items
                ],
            )
            for c in carts
        ]

    def get_by_id(self, cart_id: int) -> Optional[Cart]:
        """Retrieve a single cart by its ID."""
        cart = self.session.get(DBCart, cart_id)
        if not cart:
            return None

        return Cart(
            id=cart.id,
            user_id=cart.user_id,
            date=cart.date,
            items=[
                CartItem(product_id=i.product_id, quantity=i.quantity)
                for i in cart.items
            ],
        )

    def upsert_many(self, carts: List[Cart]) -> None:
        """Insert or update multiple carts atomically, converting date strings to datetime."""
        try:
            for cart in carts:
                # Convert date string to datetime if necessary
                if isinstance(cart.date, str):
                    cart.date = datetime.fromisoformat(cart.date.replace("Z", "+00:00"))

                db_cart = self.session.get(DBCart, cart.id)

                if not db_cart:
                    db_cart = DBCart(id=cart.id, user_id=cart.user_id, date=cart.date)
                    self.session.add(db_cart)
                    self.session.flush()
                else:
                    db_cart.user_id = cart.user_id
                    db_cart.date = cart.date
                    # Remove old items safely
                    for existing_item in list(db_cart.items):
                        self.session.delete(existing_item)
                    self.session.flush()

                # Add new items
                for item in cart.items:
                    db_cart.items.append(
                        DBCartItem(product_id=item.product_id, quantity=item.quantity)
                    )

            self.session.commit()

        except Exception as e:
            self.session.rollback()
            # Raise generic exception so upper layers can handle it
            raise RuntimeError(f"Database synchronization failed: {str(e)}")
