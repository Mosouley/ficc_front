
const BASE = 'http://localhost:' ; //  'http://localhost';
const WS_BASE = 'ws://localhost:' ; //  'http://localhost';
const PORT = '8080' ; //  8089;
// admin/
// api/contacts/
// api/fx/ ^customers/$ [name='customer-list']
// api/fx/ ^customers/(?P<pk>[^/.]+)/$ [name='customer-detail']
// api/fx/ ^segments/$ [name='segment-list']

const PATH = BASE + PORT + '/api/fx';

export const API_URLS = {
    CURRENCIES_URL:  PATH + '/currencies/',
    PRODUCTS_URL: PATH + '/products/',
    CUSTOMERS_URL:  PATH + '/customers/',
    SEGMENTS_URL:  PATH + '/segments/',
    DAILY_RATES_URL:  PATH + '/daily-rates/',
    DAILY_RATES_LOAD_URL:  PATH + '/daily-rates-loading/',
    DEALERS_URL:   PATH + '/dealers/',
    TRADES_URL:  PATH + '/trades/',
    INVOICE_URL:  PATH + '/invoice/',
    TRANSALINE_URL:  PATH + '/transactionLine/',
    USER_URL:  PATH + '/auth/all',
    SPENDINGS_URL:  PATH + '/spending',
    COMPANY_URL:  PATH + '/company',
    CASHBALANCE_URL:  PATH + '/cash',
    PRODBALANCE_URL:  PATH + '/prodBalance',
    SINGNING_URL: PATH + '/auth/signin',
    SINGNUP_URL:  PATH + '/auth/signup',
    FILE_UPLOAD_URL: PATH + '/storage/upload',
    FILE_LOADING_URL: PATH + '/storage/files',
    FILE_LOADING_ALL: PATH + '/storage/getallfiles',
    WEBSOCKETS_TRADEFLOWS : WS_BASE + PORT +'/ws/api/fx/trade_update/'
};

export const url_api ="https://api.apilayer.com/exchangerates_data/timeseries?start_date={2022-03-01}&end_date={2023-03-01}"

// var myHeaders = new Headers();
// myHeaders.append("apikey", "PVZKPPNf2FmqHagUcU0JJVG5NIEDuxY0");

// var requestOptions = {
//   method: 'GET',
//   redirect: 'follow',
//   headers: myHeaders
// };

// fetch("https://api.apilayer.com/exchangerates_data/timeseries?start_date={2022-03-01}&end_date={2023-03-01}", requestOptions)
//   .then(response => response.text())
//   .then(result => console.log(result))
//   .catch(error => console.log('error', error));
