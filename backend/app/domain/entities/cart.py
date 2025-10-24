from dataclasses import dataclass
from typing import List
from datetime import datetime


@dataclass
class CartItem:
    product_id: int
    quantity: int


@dataclass
class Cart:
    id: int
    user_id: int
    date: datetime
    items: List[CartItem]
