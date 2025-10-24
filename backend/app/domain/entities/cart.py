from dataclasses import dataclass
from typing import List


@dataclass
class CartItem:
    product_id: int
    quantity: int


@dataclass
class Cart:
    id: int
    user_id: int
    date: str
    items: List[CartItem]
