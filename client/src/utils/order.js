export const mergeItems = (order, items) => {
  // check for existing items
  const newItems = order.items.map((item) => {
    const found = items.find((i) => i.product === item.product)
    if (found) {
      item.quantity += found.quantity
    }
    return item
  })

  // add new items
  for (const item of items) {
    const found = order.items.find((i) => i.product === item.product)

    // is a new item
    if (!found) {
      newItems.push(item)
    }
  }

  return newItems
}
