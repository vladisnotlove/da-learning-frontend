class DataHistory<TData> {
	maxLength: number;

	pastItems: TData[] = [];
	nowItem?: TData;
	futureItems: TData[] = [];

	constructor(maxLength: number, initialData?: TData[]) {
		this.maxLength = Math.max(maxLength, 3);
		if (initialData) {
			initialData.forEach(data => this.add(data));
		}
	}

	get currentData () {
		return this.nowItem;
	}

	get length () {
		let value = this.pastItems.length;
		if (this.nowItem) value++;
		value += this.futureItems.length;

		return value;
	}

	get undoLength () {
		return this.pastItems.length;
	}

	add (data: TData) {
		if (this.futureItems) {
			this.futureItems = [];
		}
		if (this.nowItem) {
			this.pastItems.push(this.nowItem);
		}
		this.nowItem = data;

		if (this.length > this.maxLength) {
			const delta = this.length - this.maxLength;
			for (let i = 0; i < delta; i++) {
				this.pastItems.shift();
			}
		}
	}

	undo () {
		if (this.pastItems.length > 0) {
			const lastItem = this.pastItems.pop();
			if (this.nowItem) this.futureItems.unshift(this.nowItem);
			this.nowItem = lastItem;
		}
		else if (this.pastItems.length === 0) {
			if (this.nowItem) this.futureItems.unshift(this.nowItem);
			this.nowItem = undefined;
		}
	}

	redo () {
		if (this.futureItems.length > 0) {
			const firstItem = this.futureItems.shift();
			if (this.nowItem) this.pastItems.push(this.nowItem);
			this.nowItem = firstItem;
		}
	}

	clear () {
		this.pastItems = [];
		this.nowItem = undefined;
		this.futureItems = [];
	}
}

export default DataHistory;
