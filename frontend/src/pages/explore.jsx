import { trendingIndianStocks } from "../api/api.js"
import React, { useState, useEffect } from "react";



async function trendingStocks() {
    const trendingdStocksData = await trendingIndianStocks();
    const topGainers = trendingdStocksData.trending_stocks.top_gainers;
    const topLosers = trendingdStocksData.trending_stocks.top_losers;

    // Process top gaining stocks
    const topGainingStocks = topGainers.map(stock => ({
        symbol: stock.ticker_id,
        company: stock.company_name,
        price: stock.price,
        percentChange: stock.percent_change,
    }));

    // Process top losing stocks
    const topLosingStocks = topLosers.map(stock => ({
        symbol: stock.ticker_id,
        company: stock.company_name,
        price: stock.price,
        percentChange: stock.percent_change,
    }));
    return { topGainingStocks, topLosingStocks };
}

const weekHighStocks = [
  { symbol: "ULTRACEMCO", name: "UltraTech Cem.", price: 12237, high: 12304, change: 0.65 },
  { symbol: "BSE", name: "BSE Ltd", price: 6304, high: 6595, change: -2.93 },
  { symbol: "JKCEMENT", name: "JK Cement", price: 5245, high: 5323, change: -0.32 },
];

const news = [
  {
    title: "Sensex hits new all-time high",
    summary: "The Sensex surged to a record high amid strong earnings and positive global cues.",
    link: "#",
  },
  {
    title: "HCL Tech Q4 Results Announced",
    summary: "HCL Technologies reported robust Q4 results, beating analyst estimates.",
    link: "#",
  },
  {
    title: "Nestle India Q4 Results 2025",
    summary: "Nestle India posted a 15% jump in quarterly profits for Q4 2025.",
    link: "#",
  },
];

// Optional: Featured/Carousel section
const featured = [
  {
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    caption: "Market Movers",
  },
  {
    image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
    caption: "Top Gainers",
  },
];

const Explore = () => {
    const [topGainingStocks, setTopGainingStocks] = useState([]);
    const [topLosingStocks, setTopLosingStocks] = useState([]);

    useEffect(() => {
        async function fetchTrendingStocks() {
            const { topGainingStocks, topLosingStocks } = await trendingStocks();
            setTopGainingStocks(topGainingStocks);
            setTopLosingStocks(topLosingStocks);
        }

        fetchTrendingStocks();
    }, []);
  return(
  <div className="max-w-6xl mx-auto py-8 px-2">
    {/* Top Gaining Stocks */}
    <section className="mb-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Top Gaining Stocks</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 text-left">Company</th>
              <th className="py-2 px-4 text-right">Price (₹)</th>
              <th className="py-2 px-4 text-right">Change (%)</th>
            </tr>
          </thead>
          <tbody>
            {topGainingStocks.map((stock) => (
              <tr key={stock.symbol} className="border-b">
                <td className="py-2 px-4">{stock.company}</td>
                <td className="py-2 px-4 text-right">{stock.price.toLocaleString()}</td>
                <td className={`py-2 px-4 text-right font-semibold text-green-600`}>
                  +{stock.percentChange}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
    {/*Top Losing Stocks*/}
    <section className="mb-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Top Losing Stocks</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 text-left">Company</th>
              <th className="py-2 px-4 text-right">Price (₹)</th>
              <th className="py-2 px-4 text-right">Change (%)</th>
            </tr>
          </thead>
          <tbody>
            {topLosingStocks.map((stock) => (
              <tr key={stock.symbol} className="border-b">
                <td className="py-2 px-4">{stock.company}</td>
                <td className="py-2 px-4 text-right">{stock.price.toLocaleString()}</td>
                <td className={`py-2 px-4 text-right font-semibold text-red-600`}>
                  {stock.percentChange}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>

    {/* 52 Week High Stocks */}
    <section className="mb-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">52 Week High Stocks</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 text-left">Symbol</th>
              <th className="py-2 px-4 text-left">Company</th>
              <th className="py-2 px-4 text-right">Current Price (₹)</th>
              <th className="py-2 px-4 text-right">52W High (₹)</th>
              <th className="py-2 px-4 text-right">Change (%)</th>
            </tr>
          </thead>
          <tbody>
            {weekHighStocks.map((stock) => (
              <tr key={stock.symbol} className="border-b">
                <td className="py-2 px-4">{stock.symbol}</td>
                <td className="py-2 px-4">{stock.name}</td>
                <td className="py-2 px-4 text-right">{stock.price.toLocaleString()}</td>
                <td className="py-2 px-4 text-right">{stock.high.toLocaleString()}</td>
                <td className={`py-2 px-4 text-right font-semibold ${stock.change >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {stock.change > 0 ? "+" : ""}
                  {stock.change}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>

    {/* Trending News */}
    <section className="mb-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Trending News</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {news.map((item, idx) => (
          <div key={idx} className="bg-white p-6 rounded-lg shadow-md flex flex-col">
            <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
            <p className="text-gray-600 flex-1">{item.summary}</p>
            <a
              href={item.link}
              className="mt-4 text-green-600 hover:underline font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              Read more
            </a>
          </div>
        ))}
      </div>
    </section>

    </div>
  )
};

export default Explore;

