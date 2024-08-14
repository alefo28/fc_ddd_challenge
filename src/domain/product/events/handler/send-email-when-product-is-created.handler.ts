
import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import ProductoCreatedEvent from "../product-created.event";

export default class SendEmailWhenProductIsCreatedHandler implements EventHandlerInterface<ProductoCreatedEvent> {

    handle(event: ProductoCreatedEvent): void {
        console.log("Sending email to ........");
    }

}