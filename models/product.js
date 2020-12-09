class Product {
  constructor(id, ownerId, title,kitchenName, imageUrl, description, price) {
    this.id = id;
    this.ownerId = ownerId;
    this.imageUrl = imageUrl;
    this.title = title;
    this.kitchenName= kitchenName;
    this.description = description;
    this.price = price;
  }
}

export default Product;
