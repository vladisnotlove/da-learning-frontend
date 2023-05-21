class QNode<T> {
	value: T;
	next: QNode<T> | null;

	constructor(value: T) {
		this.value = value;
		this.next = null;
	}
}

class Queue<T> {
	first: QNode<T> | null;
	last: QNode<T> | null;
	size: number;

	constructor(...values: T[]) {
		this.first = null;
		this.last = null;
		this.size = 0;
		values.forEach(value => this.enqueue(value));
	}

	isEmpty() {
		return !this.size;
	}

	enqueue(item: T) {
		const newNode = new QNode(item);

		if (this.isEmpty()) {
			this.first = newNode;
			this.last = newNode;
		}
		else {
			(this.last as QNode<T>).next = newNode;
			this.last = newNode;
		}
		this.size++;
		return this;
	}

	dequeue() {
		if (this.isEmpty()) return null;
		const itemToBeRemoved = this.first;

		if (this.first === this.last) {
			this.last = null;
		}
		this.first = (this.first as QNode<T>).next;
		this.size--;
		return itemToBeRemoved?.value || null;
	}

	peek(offset = 0) {
		if (this.first === null) return null;
		if (offset < 0) return null;
		let i = 0;
		let node: QNode<T> | null = this.first;
		while (i < offset && node !== null) {
			i++;
			node = node.next;
		}
		return node?.value ?? null;
	}

	forEach(callback: (item: T, index: number) => void) {
		let node = this.first;
		let i = 0;

		while (node !== null) {
			callback(node.value, i);
			node = node.next;
			i++;
		}
	}
}

export default Queue;
