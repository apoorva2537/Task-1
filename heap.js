class MaxHeap {
  constructor() {
    this.heap = [];
  }

  getParentIndex(index) {
    return Math.floor((index - 1) / 2);
  }

  insert(product) {
    this.heap.push(product);
    this.heapifyUp();
  }

  heapifyUp() {
    let currentIndex = this.heap.length - 1;
    let parentIndex = this.getParentIndex(currentIndex);

    while (
      parentIndex >= 0 &&
      this.heap[parentIndex].popularity < this.heap[currentIndex].popularity
    ) {
      [this.heap[parentIndex], this.heap[currentIndex]] = [
        this.heap[currentIndex],
        this.heap[parentIndex],
      ];
      currentIndex = parentIndex;
      parentIndex = this.getParentIndex(currentIndex);
    }
  }

  removeMax() {
    if (this.heap.length === 0) {
      return null;
    }

    if (this.heap.length === 1) {
      return this.heap.pop();
    }

    const max = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.heapifyDown();

    return max;
  }

  heapifyDown() {
    let currentIndex = 0;
    let leftChildIndex = 2 * currentIndex + 1;
    let rightChildIndex = 2 * currentIndex + 2;
    let nextIndex = null;

    while (leftChildIndex < this.heap.length) {
      if (rightChildIndex < this.heap.length) {
        nextIndex =
          this.heap[leftChildIndex].popularity >
          this.heap[rightChildIndex].popularity
            ? leftChildIndex
            : rightChildIndex;
      } else {
        nextIndex = leftChildIndex;
      }

      if (
        this.heap[currentIndex].popularity < this.heap[nextIndex].popularity
      ) {
        [this.heap[currentIndex], this.heap[nextIndex]] = [
          this.heap[nextIndex],
          this.heap[currentIndex],
        ];
        currentIndex = nextIndex;
        leftChildIndex = 2 * currentIndex + 1;
        rightChildIndex = 2 * currentIndex + 2;
      } else {
        break;
      }
    }
  }
}

fetch("https://s3.amazonaws.com/open-to-cors/assignment.json")
  .then((response) => response.json())
  .then((jsonData) => {
    const products = Object.values(jsonData.products);
    const heap = new MaxHeap();

    Object.values(products).forEach((product) => {
      heap.insert(product);
    });

    const sortedProducts = [];
    while (heap.length > 0) {
      sortedProducts.push(heap.removeMax());
    }
    products.sort((a, b) => b.popularity - a.popularity);
    const productsContainer = document.getElementById("products");
    products.forEach((product) => {
      const productDiv = document.createElement("div");
      productDiv.classList.add("product");
      productDiv.innerHTML = `
            <h3>${product.title}</h3>
            <p>Price: $${product.price}</p>
            <p>Popularity: ${product.popularity}</p>
          `;
      productsContainer.appendChild(productDiv);
    });
  })
  .catch((error) => {
    console.error("Error fetching JSON:", error);
  });
