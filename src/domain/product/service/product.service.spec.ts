import Product from "../entity/product";
import ProductService from "./product.service";

describe("Product unit tests", () => {
    it("should change the prices of all products", () => {

        const product1 = new Product("producto1", "Producto 1", 10)
        const product2 = new Product("producto2", "Producto 2", 20)
        const products = [product1, product2];

        ProductService.increasePrice(products, 100);

        expect(product1.price).toBe(20)
        expect(product2.price).toBe(40)

    })
})