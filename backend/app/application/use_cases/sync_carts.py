from app.domain.repositories.cart_repository_interface import ICartRepository
from app.infrastructure.external.fakestore_service import FakeStoreService


def sync_carts(repo: ICartRepository):
    service = FakeStoreService()
    carts = service.fetch_carts()
    repo.upsert_many(carts)
