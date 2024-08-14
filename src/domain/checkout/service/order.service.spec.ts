import OrderItem from "../entity/order_item";
import Order from "../entity/order";
import OrderService from './order.service';
import Customer from "../../customer/entity/customer";


describe("Order unit tests", () => {
    it("should get total of all orders", () => {
        const item = new OrderItem("1", "Item 1", 100, "p1", 1)
        const item2 = new OrderItem("2", "Item 2", 200, "p2", 2)

        const order = new Order("o1", "client1", [item])
        const order2 = new Order("o2", "client1", [item2])

        const total = OrderService.total([order, order2])

        expect(total).toBe(500)
    })

    it("should place an order", () => {

        const customer = new Customer("c1", "Custumer 1")
        const item = new OrderItem("i1", "Item 1", 10, "p1", 1)

        const order = OrderService.placeOrder(customer, [item])

        expect(customer.rewardPoints).toBe(5)
        expect(order.total()).toBe(10)
    })
})