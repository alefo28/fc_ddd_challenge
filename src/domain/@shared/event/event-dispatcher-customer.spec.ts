
import CustomerChangeAddressEvent from "../../customer/event/customer-change-address.event";
import CustomerCreatedEvent from "../../customer/event/customer-created.event";
import EnviaConsoleLog1Handler from "../../customer/event/handler/EnviaConsoleLog1Handler";
import EnviaConsoleLog2Handler from "../../customer/event/handler/EnviaConsoleLog2Handler";
import EnviaConsoleLogHandler from "../../customer/event/handler/EnviaConsoleLogHandler";
import EventDispatcher from "./event-dispatcher";

describe('Domain Events test Customer', () => {

    it("should print handler1 and handler2 when is created a customer", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler1 = new EnviaConsoleLog1Handler()
        const eventHandler2 = new EnviaConsoleLog2Handler()

        const spyEventHandler1 = jest.spyOn(eventHandler1, "handle")
        const spyEventHandler2 = jest.spyOn(eventHandler2, "handle")

        eventDispatcher.register("CustomerCreatedEvent", eventHandler1)
        eventDispatcher.register("CustomerCreatedEvent", eventHandler2)

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(eventHandler1)
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]).toMatchObject(eventHandler2)

        const customerCreatedEvent = new CustomerCreatedEvent({
            id: "1",
            name: "Customer 1",
            address: "Customer 1 Address",

        });

        eventDispatcher.notify(customerCreatedEvent)

        expect(spyEventHandler1).toHaveBeenCalled()
        expect(spyEventHandler2).toHaveBeenCalled()
    })

    it("should print address", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new EnviaConsoleLogHandler()
        const spyEventHandler = jest.spyOn(eventHandler, "handle")

        eventDispatcher.register("CustomerChangeAddressEvent", eventHandler)

        expect(eventDispatcher.getEventHandlers["CustomerChangeAddressEvent"][0]).toMatchObject(eventHandler)

        const customerChangeAddressEvent = new CustomerChangeAddressEvent({
            id: "1",
            name: "Customer 1",
            address: "Customer 1 Address",
        });

        eventDispatcher.notify(customerChangeAddressEvent)

        expect(spyEventHandler).toHaveBeenCalled()
    })
})