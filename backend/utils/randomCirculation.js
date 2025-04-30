export function getRandomCirculation(quantity) {
    const maxVariation = quantity * 0.5;
    const variation = Math.floor(Math.random() * maxVariation);

    const dynamicBias = 0.3 + Math.random() * 0.4; // bias is in [0.3, 0.7]
    const plusOrMinus = Math.random() < dynamicBias ? -1 : 1;

    return quantity + (plusOrMinus * variation);
}

export function getInitialRandomCirculation(quantity) {
    const maxVariation = quantity * 0.5;
    const variation = Math.floor(Math.random() * maxVariation);

    // Make bias lean more toward negative
    const dynamicBias = 0.75 + Math.random() * 0.1; // bias is in [0.75, 0.85]
    const plusOrMinus = Math.random() < dynamicBias ? -1 : 1;

    return quantity + (plusOrMinus * variation);
}