import requests
from app.domain.entities.cart import Cart, CartItem
from app.core.config import settings


class FakeStoreService:
    def fetch_carts(self):
        response = requests.get(settings.FAKE_STORE_API)
        response.raise_for_status()
        data = response.json()
        return [
            Cart(
                id=c["id"],
                user_id=c["userId"],
                date=c["date"],
                items=[
                    CartItem(product_id=i["productId"], quantity=i["quantity"])
                    for i in c["products"]
                ],
            )
            for c in data
        ]
