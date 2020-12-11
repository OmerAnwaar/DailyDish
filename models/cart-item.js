class CartItem {
  constructor(id,quantity, productPrice, productTitle, sum,ownerId,kitchenName) {
    this.id=id
    this.quantity = quantity;
    this.productPrice = productPrice;
    this.productTitle = productTitle;
    this.sum = sum;
    this.ownerId= ownerId;
    this.kitchenName=kitchenName
  }
}

export default CartItem;
