import { Sequelize } from "sequelize-typescript"
import CustomerModel from "../../../customer/repository/sequelize/customer.model";
import Customer from "../../../../domain/customer/entity/customer";
import Address from "../../../../domain/customer/value-objeto/address";
import OrderModel from "./order.model";
import OrderItemModel from "./order-item.model";
import ProductModel from "../../../product/repository/sequelize/product.model";
import CustomerRepository from "../../../customer/repository/sequelize/customer.repository";
import ProductRepository from "../../../product/repository/sequelize/product.repository";
import Product from "../../../../domain/product/entity/product";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import Order from "../../../../domain/checkout/entity/order";
import OrderRepository from "./order.repository";

describe('Order Repository test', () => {

    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true }
        })

        sequelize.addModels([OrderModel, OrderItemModel, CustomerModel, ProductModel])
        await sequelize.sync()
    })

    afterEach(async () => {
        await sequelize.close()
    })

    it("should create a new order", async () => {
        const customerRepository = new CustomerRepository()
        const customer = new Customer("1", "Customer 1")
        const address = new Address("street 1", 1, "Zipcode 1", "City 1")
        customer.Address = address
        await customerRepository.create(customer)

        const productRepository = new ProductRepository()
        const product = new Product("1", "Product 1", 100)
        await productRepository.create(product)

        const ordemItem = new OrderItem("1", product.name, product.price, product.id, 2)

        const order = new Order("1", customer.id, [ordemItem])

        const orderRespository = new OrderRepository()
        await orderRespository.create(order)

        const orderModel = await OrderModel.findOne({ where: { id: order.id }, include: ["items"] })

        expect(orderModel.toJSON()).toStrictEqual({
            id: "1",
            customer_id: "1",
            total: order.total(),
            items: [
                {
                    id: ordemItem.id,
                    name: ordemItem.name,
                    price: ordemItem.price,
                    quantity: ordemItem.quantity,
                    order_id: "1",
                    product_id: ordemItem.productId
                },
            ]
        })

    })

    it("should update a order", async () => {
        const customerRepository = new CustomerRepository()

        const customer = new Customer("1", "Customer 1")
        const address = new Address("street 1", 1, "Zipcode 1", "City 1")
        customer.Address = address
        await customerRepository.create(customer)

        const customer2 = new Customer("2", "Customer 2")
        const address2 = new Address("street 2", 2, "Zipcode 2", "City 2")
        customer2.Address = address2
        await customerRepository.create(customer2)

        const productRepository = new ProductRepository()

        const product = new Product("1", "Product 1", 100)
        await productRepository.create(product)
        const product2 = new Product("2", "Product 2", 200)
        await productRepository.create(product2)
        const product3 = new Product("3", "Product 3", 100)
        await productRepository.create(product3)

        const ordemItem = new OrderItem("1", product.name, product.price, product.id, 2)
        const ordemItem2 = new OrderItem("2", product2.name, product2.price, product2.id, 2)
        const ordemItem3 = new OrderItem("3", product3.name, product3.price, product3.id, 1)
        const order = new Order("1", customer.id, [ordemItem, ordemItem3])

        const orderRespository = new OrderRepository()
        await orderRespository.create(order)

        order.changeCustomer("2")
        order.changeQuantity(ordemItem, 1)
        order.addItems([ordemItem2])
        order.removeItem("3")


        await orderRespository.Update(order)

        const orderModel = await OrderModel.findOne({ where: { id: order.id }, include: ["items"] })

        expect(orderModel.toJSON()).toStrictEqual({
            id: "1",
            customer_id: "2",
            total: order.total(),
            items: [
                {
                    id: ordemItem.id,
                    name: ordemItem.name,
                    price: ordemItem.price,
                    quantity: ordemItem.quantity,
                    order_id: "1",
                    product_id: ordemItem.productId
                },
                {
                    id: ordemItem2.id,
                    name: ordemItem2.name,
                    price: ordemItem2.price,
                    quantity: ordemItem2.quantity,
                    order_id: "1",
                    product_id: ordemItem2.productId
                },
            ]
        })
    })

    it("should find a order", async () => {

        const customerRepository = new CustomerRepository()
        const customer = new Customer("1", "Customer 1")
        const address = new Address("street 1", 1, "Zipcode 1", "City 1")
        customer.Address = address
        await customerRepository.create(customer)

        const productRepository = new ProductRepository()
        const product = new Product("1", "Product 1", 100)
        await productRepository.create(product)

        const ordemItem = new OrderItem("1", product.name, product.price, product.id, 2)

        const order = new Order("1", customer.id, [ordemItem])

        const orderRespository = new OrderRepository()
        await orderRespository.create(order)

        const orderfound = await orderRespository.find("1")
        const orderModel = await OrderModel.findOne({ where: { id: order.id }, include: ["items"] })


        expect(orderModel.toJSON()).toStrictEqual({
            id: orderfound.id,
            customer_id: orderfound.customerId,
            total: orderfound.total(),
            items: [
                {
                    id: ordemItem.id,
                    name: ordemItem.name,
                    price: ordemItem.price,
                    quantity: ordemItem.quantity,
                    order_id: "1",
                    product_id: ordemItem.productId
                },
            ]
        })


    })

    it("should find all orders", async () => {

        const customerRepository = new CustomerRepository()
        const customer = new Customer("1", "Customer 1")
        const address = new Address("street 1", 1, "Zipcode 1", "City 1")
        customer.Address = address
        await customerRepository.create(customer)

        const productRepository = new ProductRepository()
        const product = new Product("1", "Product 1", 100)
        await productRepository.create(product)

        const ordemItem = new OrderItem("1", product.name, product.price, product.id, 2)
        const ordemItem2 = new OrderItem("2", product.name, product.price, product.id, 4)

        const order = new Order("1", customer.id, [ordemItem])
        const order2 = new Order("2", customer.id, [ordemItem2])

        const orderRespository = new OrderRepository()
        await orderRespository.create(order)
        await orderRespository.create(order2)

        const orders = [order, order2]

        const ordersFound = await orderRespository.findAll()

        expect(ordersFound).toEqual(orders)

    })

})
