import React from 'react';
import ReactDOM from 'react-dom/client';
import {CoffeeMarket_w} from "./pages/CoffeeMarketView";
import {PaymentView_w} from "./pages/PaymentView";
import {Routes, Route, BrowserRouter} from 'react-router-dom'
import {Provider} from "react-redux";
import {getStore} from "./store/store";

const url = new URL(location.href)
if (url.pathname == '/payment' && url.searchParams.get('coffee_id') == null){
    location.replace(location.origin)
}

const store = getStore()

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path='/' element={
                    <Provider store={store}>
                        <CoffeeMarket_w/>
                    </Provider>}/>
                <Route path='/payment' element={
                    <Provider store={store}>
                        <PaymentView_w/>
                    </Provider>}/>

            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);
