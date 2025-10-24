from app.domain.entities.cart import Cart
from app.domain.repositories.cart_repository_interface import ICartRepository


def get_cart_by_id(repo: ICartRepository, cart_id: int) -> Cart | None:
    return repo.get_by_id(cart_id)
