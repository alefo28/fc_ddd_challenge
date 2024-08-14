import OrderItem from "./order_item";


export default class Order {

    private _id: string;
    private _customerId: string;
    private _items: OrderItem[];
    private _total: number;

    constructor(id: string, customerId: string, items: OrderItem[]) {
        this._id = id;
        this._customerId = customerId;
        this._items = items;
        this._total = this.total()
        this.validate()
    }

    get id(): string {
        return this._id
    }

    get customerId(): string {
        return this._customerId
    }

    get items(): OrderItem[] {
        return this._items
    }

    validate(): boolean {
        if (this._id.length === 0) {
            throw new Error("Id is required");
        }

        if (this._customerId.length === 0) {
            throw new Error("customerId is required");
        }

        if (this._items.length === 0) {
            throw new Error("items are required");
        }
        if (this._items.some(item => item.quantity <= 0)) {
            throw new Error("Quantity must be greater than 0");
        }

        return true
    }

    total(): number {
        return this._items.reduce((acc, item) => acc + item.orderItemTotal(), 0);
    }

    changeCustomer(customerId: string): void {
        this._customerId = customerId
    }

    changeQuantity(item: OrderItem, quantity: number): void {
        item.changeQuantity(quantity)
        this._total = this.total()
    }

    addItems(items: OrderItem[]): void {
        for (const item of items) {
            const existingItem = this._items.find(i => i.productId === item.productId);
            if (!existingItem) {
                this._items.push(item);
            }
        }
    }

    removeItem(id: string): void {
        if (this._items.length === 1) {
            throw new Error("Cannot remove the last item from the order");
        }

        const findItem = this._items.findIndex(item => item.id === id);
        if (findItem !== -1) {
            this._items.splice(findItem, 1);
        }
    }
}