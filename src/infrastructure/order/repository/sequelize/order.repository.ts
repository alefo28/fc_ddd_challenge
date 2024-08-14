import Order from "../../../../domain/checkout/entity/order";
import OrderRepositoryInterface from "../../../../domain/checkout/repository/order-repository.interface"
import OrderItem from "../../../../domain/checkout/entity/order_item";
import OrderModel from "./order.model";
import OrderItemModel from "./order-item.model";

export default class OrderRepository implements OrderRepositoryInterface {

    async create(entity: Order): Promise<void> {


        await OrderModel.create({
            id: entity.id,
            customer_id: entity.customerId,
            total: entity.total(),
            items: entity.items.map((item) => ({
                id: item.id,
                name: item.name,
                price: item.price,
                product_id: item.productId,
                quantity: item.quantity
            }))
        },
            {
                include: [{ model: OrderItemModel }]
            })

    }
    async Update(entity: Order): Promise<void> {

        try {

            await OrderModel.update(
                {
                    customer_id: entity.customerId,
                    total: entity.total(),
                },
                {
                    where: { id: entity.id },
                }
            );

            const existingItems = await OrderItemModel.findAll({
                where: { order_id: entity.id },
            });

            const existingItemIds = existingItems.map(item => item.id);
            const newItemIds = entity.items.map(item => item.id);
            const itemsToDelete = existingItems.filter(
                item => !newItemIds.includes(item.id)
            );

            await OrderItemModel.destroy({
                where: { id: itemsToDelete.map(item => item.id) },
            });

            for (const item of entity.items) {
                if (existingItemIds.includes(item.id)) {
                    await OrderItemModel.update(
                        {
                            name: item.name,
                            price: item.price,
                            product_id: item.productId,
                            quantity: item.quantity,
                        },
                        {
                            where: { id: item.id },
                        }
                    );
                } else {
                    await OrderItemModel.create(
                        {
                            id: item.id,
                            order_id: entity.id,
                            name: item.name,
                            price: item.price,
                            product_id: item.productId,
                            quantity: item.quantity,
                        }
                    );
                }
            }

        } catch (error) {
            console.log(error);

            throw new Error("Order update failed");

        }

    }

    async find(id: string): Promise<Order> {

        let orderModel;
        let orderItems = [];
        try {
            orderModel = await OrderModel.findOne({
                where: { id: id },
                rejectOnEmpty: true,
                include: ["items"]
            })

            orderItems = orderModel.items.map(itemModel => {
                let orderItem = new OrderItem(itemModel.id, itemModel.name, itemModel.price, itemModel.product_id, itemModel.quantity);
                return orderItem;
            });
        } catch (error) {
            throw new Error("Order not found");
        }

        const order = new Order(id, orderModel.customer_id, orderItems);

        return order;
    }

    async findAll(): Promise<Order[]> {
        const orderModels = await OrderModel.findAll({
            include: ["items"]
        });

        let orders = [];

        for (const orderModel of orderModels) {

            const orderItems = orderModel.items.map(itemModel => {
                let orderItem = new OrderItem(itemModel.id, itemModel.name, itemModel.price, itemModel.product_id, itemModel.quantity);
                return orderItem;
            });

            const order = new Order(orderModel.id, orderModel.customer_id, orderItems);
            orders.push(order);
        }

        return orders;
    }


}