from typing import List
from app.domain.entities.cart import Cart
from app.domain.repositories.cart_repository_interface import ICartRepository


def get_carts(repo: ICartRepository) -> List[Cart]:
    return repo.get_all()
