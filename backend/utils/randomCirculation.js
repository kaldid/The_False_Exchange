export function getRandomCirculation(quantity) {
    const variation = Math.floor(Math.random() * (quantity * 0.5)); // 0-50% variation
    const plusOrMinus = Math.random() < 0.5 ? -1 : 1;
    return quantity + (plusOrMinus * variation);
}