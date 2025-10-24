from typing import List, Optional
from datetime import date
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
            query = query.where(DBCart.date >= start_date)
        if end_date:
            query = query.where(DBCart.date <= end_date)

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
        """Insert or update multiple carts atomically."""
        try:
            for cart in carts:
                db_cart = self.session.get(DBCart, cart.id)

                if not db_cart:
                    db_cart = DBCart(id=cart.id, user_id=cart.user_id, date=cart.date)
                    self.session.add(db_cart)
                    self.session.flush()
                else:
                    db_cart.user_id = cart.user_id
                    db_cart.date = cart.date
                    for existing_item in list(db_cart.items):
                        self.session.delete(existing_item)
                    self.session.flush()

                for item in cart.items:
                    db_cart.items.append(
                        DBCartItem(product_id=item.product_id, quantity=item.quantity)
                    )

            self.session.commit()

        except Exception as e:
            self.session.rollback()
            # Raise generic exception so upper layers can handle it
            raise RuntimeError(f"Database synchronization failed: {str(e)}")
