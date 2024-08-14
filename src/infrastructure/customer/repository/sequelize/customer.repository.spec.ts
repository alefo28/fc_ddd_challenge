import { Sequelize } from "sequelize-typescript"
import CustomerModel from "./customer.model";
import CustomerRepository from "./customer.repository";
import Customer from "../../../../domain/customer/entity/customer";
import Address from "../../../../domain/customer/value-objeto/address";

describe('Customer Repository test', () => {

    let sequelize: Sequelize;


    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true }
        })

        sequelize.addModels([CustomerModel])
        await sequelize.sync()
    })

    afterEach(async () => {
        await sequelize.close()
    })

    it("should create a customer", async () => {

        const customerRepository = new CustomerRepository()
        const customer = new Customer("1", "Customer 1")
        const address = new Address("street 1", 1, "Zipcode 1", "City 1")
        customer.Address = address
        await customerRepository.create(customer)

        const customerModel = await CustomerModel.findOne({ where: { id: "1" } })

        expect(customerModel.toJSON()).toStrictEqual({
            id: "1",
            name: customer.name,
            active: customer.isActive(),
            rewardPoints: customer.rewardPoints,
            street: address.street,
            number: address.number,
            zipcode: address.zip,
            city: address.city
        })
    })

    it("should update a customer", async () => {
        const customerRepository = new CustomerRepository()
        const customer = new Customer("1", "Customer 1")
        const address = new Address("street 1", 1, "Zipcode 1", "City 1")
        customer.Address = address
        await customerRepository.create(customer)

        customer.changeName("Customer 2")
        await customerRepository.Update(customer);
        const customerModel = await CustomerModel.findOne({ where: { id: "1" } })

        expect(customerModel.toJSON()).toStrictEqual({
            id: "1",
            name: customer.name,
            active: customer.isActive(),
            rewardPoints: customer.rewardPoints,
            street: address.street,
            number: address.number,
            zipcode: address.zip,
            city: address.city
        })
    })

    it("should find a customer", async () => {
        const customerRepository = new CustomerRepository()
        const customer = new Customer("1", "Customer 1")
        const address = new Address("street 1", 1, "Zipcode 1", "City 1")
        customer.Address = address
        await customerRepository.create(customer)

        const foundCustomer = await customerRepository.find("1")

        expect(customer).toStrictEqual(foundCustomer)
    })

    it("should throw an error when customer is not found", async () => {
        const customerRepository = new CustomerRepository()
        expect(async () => {
            await customerRepository.find("1325")
        }).rejects.toThrow("Customer not found")
    })


    it("should find all a customers", async () => {
        const customerRepository = new CustomerRepository()

        const customer1 = new Customer("1", "Customer 1")
        const address1 = new Address("street 1", 1, "Zipcode 1", "City 1")
        customer1.Address = address1
        customer1.addRewardPoints(10)
        customer1.activate()
        await customerRepository.create(customer1)

        const customer2 = new Customer("2", "Customer 2")
        const address2 = new Address("street 2", 2, "Zipcode 2", "City 2")
        customer2.Address = address2
        customer2.addRewardPoints(20)
        customer2.activate()
        await customerRepository.create(customer2)


        const foundCustomers = await customerRepository.findAll()
        const customers = [customer1, customer2]

        expect(foundCustomers).toHaveLength(2)
        expect(foundCustomers).toContainEqual(customer2)
        expect(customers).toEqual(foundCustomers)
    })

})
