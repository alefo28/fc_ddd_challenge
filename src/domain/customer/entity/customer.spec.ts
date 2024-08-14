import Address from "../value-objeto/address";
import Customer from "./customer";


describe("Customer unit tests", () => {

    it("Should throw error when id is empty", () => {

        expect(() => {
            let customer = new Customer("", "aLEF");
        }).toThrow("Id is required");
    })

    it("Should throw error when name is empty", () => {

        expect(() => {
            let customer = new Customer("123", "");
        }).toThrow("Name is required");
    })

    it("Should change name", () => {

        //Arrange
        const customer = new Customer("123", "Alef")
        //Act
        customer.changeName("john")
        //Assert
        expect(customer.name).toBe("john")
    })

    it("Should activate customer", () => {


        const customer = new Customer("1", "Customer 1")
        const address = new Address("street 1", 123, "12345-687", "Monterrey")
        customer.Address = address;

        customer.activate()

        expect(customer.isActive()).toBe(true)
    })

    it("Should deactivate customer", () => {


        const customer = new Customer("1", "Customer 1")
        /* const address = new Address("street 1", 123, "12345-687", "Monterrey")
        customer.Address = address;

        customer.activate() */
        customer.deativate()

        expect(customer.isActive()).toBe(false)
    })

    it("Should throw error when address is undefined when you activate a customer", () => {

        expect(() => {
            const customer = new Customer("1", "Customer 1")
            customer.activate()
        }).toThrow("address is mandatory to activate a customer")

    })

    it("should add reward points", () => {
        const customer = new Customer("1", "Customer 1")
        expect(customer.rewardPoints).toBe(0)

        customer.addRewardPoints(10)
        expect(customer.rewardPoints).toBe(10)

        customer.addRewardPoints(10)
        expect(customer.rewardPoints).toBe(20)
    })


}) 