import axios from 'axios';

const ALPHA_VANTAGE_API_KEY = 'ONEWZ1PBZVZSFEST';

export const fetchMarketNews = async () => {
    try {
        const response = await axios.get(`https://www.alphavantage.co/query?function=NEWS_SENTIMENT&apikey=${ALPHA_VANTAGE_API_KEY}`);
        //console.log(response.data); // Debugging: Check if API returns correct data
        const newsFeed = response.data.feed || [];

        // Format and return relevant fields
        return newsFeed.map(news => ({
            title: news.title,
            summary: news.summary,
            source: news.source,
            time: news.time_published,
            url: news.url,
            overall_sentiment_score: news.overall_sentiment_score,
            ticker_sentiment: news.ticker_sentiment // Check if ticker_sentiment data is available for charts
        }));
    } catch (error) {
        console.error("Error fetching market news:", error);
        return [];
    }
};

// Fetch stock data for a given ticker
export const fetchStockData = async (ticker) => {
    try {
        const response = await axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${ticker}&apikey=${ALPHA_VANTAGE_API_KEY}`);
        const timeSeries = response.data['Time Series (Daily)'] || {};

        // Parse stock prices and dates
        const dates = Object.keys(timeSeries);
        const prices = dates.map(date => timeSeries[date]['4. close']);

        return { dates, prices };
    } catch (error) {
        console.error(`Error fetching stock data for ${ticker}:`, error);
        return {};
    }
};