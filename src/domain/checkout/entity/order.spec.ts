import Order from "./order"
import OrderItem from "./order_item"

describe("Order unit tests", () => {

    it("Should throw error when id is empty", () => {
        expect(() => {
            let order = new Order("", "123", [])
        }).toThrow("Id is required")

    })

    it("Should throw error when customer_id is empty", () => {
        expect(() => {
            let order = new Order("123", "", [])
        }).toThrow("customerId is required")

    })

    it("Should throw error when items are empty", () => {
        expect(() => {
            let order = new Order("123", "123", [])
        }).toThrow("items are required")

    })

    it("Should calculate total", () => {

        const item = new OrderItem("1", "item 1", 10, "p1", 2)
        const item2 = new OrderItem("2", "item 2", 15, "p2", 2)

        const order = new Order("1", "123", [item, item2])

        const total = order.total()
        expect(total).toBe(50)

    })

    it("Should throw error if the item qte is less or equal 0", () => {
        expect(() => {
            const item = new OrderItem("1", "item 1", 10, "p1", 0)

            const order = new Order("1", "123", [item])
        }).toThrow("Quantity must be greater than 0")

    })

    it("should change customer", () => {
        const item = new OrderItem("1", "item 1", 10, "p1", 2)
        const order = new Order("1", "123", [item])

        order.changeCustomer("321")

        expect(order.customerId).toBe("321")
    })

    it("should change quantity of a item", () => {
        const item = new OrderItem("1", "item 1", 10, "p1", 2)

        const order = new Order("1", "123", [item])

        order.changeQuantity(item, 1)

        expect(item.quantity).toBe(1)
        expect(order.total()).toBe(10)
    })

    it("should add a item", () => {
        const item = new OrderItem("1", "item 1", 10, "p1", 2)

        const order = new Order("1", "123", [item])

        const item2 = new OrderItem("2", "item 2", 20, "p2", 2)

        order.addItems([item2])

        const items = [item, item2]

        expect(order.items).toEqual(items)

    })

    it("Should throw error when remove the last item", () => {
        expect(() => {
            const item = new OrderItem("1", "item 1", 10, "p1", 2)

            const order = new Order("1", "123", [item])

            order.removeItem("1")
        }).toThrow("Cannot remove the last item from the order")
    })

    it("should remove a item", () => {
        const item = new OrderItem("1", "item 1", 10, "p1", 2)
        const item2 = new OrderItem("2", "item 2", 20, "p2", 2)

        const order = new Order("1", "123", [item, item2])

        order.removeItem("2")

        expect(order.items).toEqual([item])
    })
}) 