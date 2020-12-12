class Product {
  constructor(id, ownerId, title,kitchenName, imageUrl, description, price,timestamp,category) {
    this.id = id;
    this.ownerId = ownerId;
    this.imageUrl = imageUrl;
    this.title = title;
    this.kitchenName= kitchenName;
    this.description = description;
    this.price = price;
    this.timestamp=timestamp;
    this.category= category
  }
}

export default Product;
