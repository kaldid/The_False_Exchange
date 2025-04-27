const API_KEY = process.env.REACT_APP_STOCK_API_KEY

export const trendingIndianStocks = async () => {
    try{
        const response = await fetch('https://stock.indianapi.in/trending', {
            headers: {
                'X-Api-Key': API_KEY
            }
        })
        const data = await response.json();
        return data;
    } catch(error) {
        throw error
    }
}

export const stockNews = async () => {
    try{
        const response = await fetch('https://stock.indianapi.in/news', {
            header: {
                'X-Api-Key': API_KEY
            }
        })
        const data = await response.json();
        return data;
    } catch(error) {
        throw error
    }
}
