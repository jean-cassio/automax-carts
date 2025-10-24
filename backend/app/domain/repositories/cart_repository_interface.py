from typing import List, Optional
from abc import ABC, abstractmethod
from app.domain.entities.cart import Cart


class ICartRepository(ABC):

    @abstractmethod
    def get_all(self) -> List[Cart]:
        pass

    @abstractmethod
    def get_by_id(self, cart_id: int) -> Optional[Cart]:
        pass

    @abstractmethod
    def upsert_many(self, carts: List[Cart]) -> None:
        pass
