// Market Data functionality using NSE API
const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';

async function fetchMarketData() {
    try {
        // Using NSE India API
        const response = await fetch('https://www.nseindia.com/api/market-data-pre-open?key=FO', {
            headers: {
                'Accept': 'application/json',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': 'en-US,en;q=0.9',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36'
            }
        });
        
        const data = await response.json();
        
        // Find Nifty and Bank Nifty data from the response
        const niftyData = data.data.find(item => item.metadata.symbol === 'NIFTY 50');
        const bankNiftyData = data.data.find(item => item.metadata.symbol === 'NIFTY BANK');

        if (niftyData) {
            document.getElementById('nifty-price').textContent = 
                parseFloat(niftyData.lastPrice).toFixed(2);
            updatePriceChange('nifty-change', parseFloat(niftyData.change));
        }

        if (bankNiftyData) {
            document.getElementById('banknifty-price').textContent = 
                parseFloat(bankNiftyData.lastPrice).toFixed(2);
            updatePriceChange('banknifty-change', parseFloat(bankNiftyData.change));
        }

    } catch (error) {
        console.error('Error fetching market data:', error);
        // Fallback to alternative API
        try {
            const response = await fetch('https://priceapi.moneycontrol.com/pricefeed/nse/equities/indices/in%3BNSX');
            const data = await response.json();
            
            if (data.data) {
                document.getElementById('nifty-price').textContent = data.data.pricecurrent;
                updatePriceChange('nifty-change', parseFloat(data.data.pricechange));
                
                // Fetch Bank Nifty
                const bnResponse = await fetch('https://priceapi.moneycontrol.com/pricefeed/nse/equities/indices/in%3BBNX');
                const bnData = await bnResponse.json();
                
                if (bnData.data) {
                    document.getElementById('banknifty-price').textContent = bnData.data.pricecurrent;
                    updatePriceChange('banknifty-change', parseFloat(bnData.data.pricechange));
                }
            }
        } catch (fallbackError) {
            console.error('Fallback API also failed:', fallbackError);
        }
    }
}

function updatePriceChange(elementId, change) {
    const element = document.getElementById(elementId);
    element.textContent = change.toFixed(2);
    element.className = change >= 0 ? 'price-up' : 'price-down';
}

// Fetch initially and then every minute
fetchMarketData();
setInterval(fetchMarketData, 60000); // Update every minute
