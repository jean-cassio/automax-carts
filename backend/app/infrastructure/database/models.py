from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship


class CartItem(SQLModel, table=True):
    __tablename__ = "cartitem"

    id: Optional[int] = Field(default=None, primary_key=True)
    product_id: int
    quantity: int
    cart_id: int = Field(foreign_key="cart.id")

    cart: Optional["Cart"] = Relationship(back_populates="items")


class Cart(SQLModel, table=True):
    __tablename__ = "cart"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int
    date: str

    items: List[CartItem] = Relationship(back_populates="cart")
