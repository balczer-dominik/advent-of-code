type Item<T> = {
  item: T;
  nextItem: Item<T> | undefined;
};

export class MyCircularIterator<T> {
  private items: Item<T>[];
  private currentValue: Item<T>;

  constructor(...items: T[]) {
    if (items.length === 0) {
      throw new Error(
        "[Cyclic iterator]: Cannot initialize cyclic iterator without items"
      );
    }

    this.items = items.map((item) => ({
      item,
      nextItem: undefined,
    })) as Item<T>[];

    this.items.forEach((tempItem, index) => {
      tempItem.nextItem =
        index === this.items.length - 1 ? this.items[0] : this.items[index + 1];
    });

    this.currentValue = this.items[this.items.length - 1];
  }

  public next(): T {
    this.currentValue = this.currentValue.nextItem!;
    return this.currentValue.item;
  }
}
