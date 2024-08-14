import Address from "../value-objeto/address"
import CustomerFactory from "./customer.factory"

describe("Customer factory unit test", () => {
    it("should create a customer", () => {
        let customer = CustomerFactory.create("John")

        expect(customer.id).toBeDefined()
        expect(customer.name).toBe("John")
        expect(customer.Address).toBeUndefined()
    })

    it("should create a customer with an addres", () => {

        const address = new Address("Street", 123, "State", "Zip")

        let customer = CustomerFactory.createWithAddress("John", address)

        expect(customer.id).toBeDefined()
        expect(customer.name).toBe("John")
        expect(customer.Address).toBe(address)


    })
})