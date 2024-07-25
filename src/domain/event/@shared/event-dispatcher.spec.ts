import CustomerChangeAddressEvent from "../customer/customer-change-address.event";
import CustomerCreatedEvent from "../customer/customer-created.event";
import EnviaConsoleLog1Handler from "../customer/handler/EnviaConsoleLog1Handler";
import EnviaConsoleLog2Handler from "../customer/handler/EnviaConsoleLog2Handler";
import EnviaConsoleLogHandler from "../customer/handler/EnviaConsoleLogHandler";
import SendEmailWhenProductIsCreatedHandler from "../product/handler/send-email-when-product-is-created.handler";
import ProductoCreatedEvent from "../product/product-created.event";
import EventDispatcher from "./event-dispatcher";

describe('Domain Events test', () => {

    it("should register an event handler", () => {

        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler()

        eventDispatcher.register("ProductoCreatedEvent", eventHandler)

        expect(eventDispatcher.getEventHandlers["ProductoCreatedEvent"]).toBeDefined()
        expect(eventDispatcher.getEventHandlers["ProductoCreatedEvent"].length).toBe(1)
        expect(eventDispatcher.getEventHandlers["ProductoCreatedEvent"][0]).toMatchObject(eventHandler)
    })

    it("should unregister an event handler", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler()

        eventDispatcher.register("ProductoCreatedEvent", eventHandler)

        expect(eventDispatcher.getEventHandlers["ProductoCreatedEvent"][0]).toMatchObject(eventHandler)

        eventDispatcher.unregister("ProductoCreatedEvent", eventHandler)

        expect(eventDispatcher.getEventHandlers["ProductoCreatedEvent"]).toBeDefined()
        expect(eventDispatcher.getEventHandlers["ProductoCreatedEvent"].length).toBe(0)
    })

    it("should unregister all event handlers", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler()

        eventDispatcher.register("ProductoCreatedEvent", eventHandler)

        expect(eventDispatcher.getEventHandlers["ProductoCreatedEvent"][0]).toMatchObject(eventHandler)

        eventDispatcher.unregisterAll()
        expect(eventDispatcher.getEventHandlers["ProductoCreatedEvent"]).toBeUndefined()

    })

    it("should notify all event handlers", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler()
        const spyEventHandler = jest.spyOn(eventHandler, "handle")

        eventDispatcher.register("ProductoCreatedEvent", eventHandler)

        expect(eventDispatcher.getEventHandlers["ProductoCreatedEvent"][0]).toMatchObject(eventHandler)

        const productoCreatedEvent = new ProductoCreatedEvent({
            name: "Product",
            descroption: "Product 1 description",
            price: 10.0
        });

        eventDispatcher.notify(productoCreatedEvent)

        expect(spyEventHandler).toHaveBeenCalled()
    })

    
})

