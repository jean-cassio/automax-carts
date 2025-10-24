from typing import List, Optional
from datetime import date
from app.domain.entities.cart import Cart
from app.domain.repositories.cart_repository_interface import ICartRepository


class CartService:
    def __init__(self, repository: ICartRepository):
        self.repository = repository

    def get_all(
        self,
        user_id: Optional[int] = None,
        start_date: Optional[date] = None,
        end_date: Optional[date] = None,
    ) -> List[Cart]:
        return self.repository.get_all(
            user_id=user_id, start_date=start_date, end_date=end_date
        )

    def get_by_id(self, cart_id: int) -> Optional[Cart]:
        return self.repository.get_by_id(cart_id)

    def upsert_many(self, carts: List[Cart]) -> None:
        self.repository.upsert_many(carts)
