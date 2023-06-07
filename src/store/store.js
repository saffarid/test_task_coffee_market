import thunk from 'redux-thunk';
import {applyMiddleware, createStore} from 'redux'
import {reducer} from "./reducer";
import {e_actions} from "./e_actions";
import {coffies} from "../js/coffies";
import {paymentMode} from "../js/paymentMode";

let store

export const getStore = () => {
    if (!store) {
        store = createStore(reducer, applyMiddleware(thunk))
        const url = new URL(location.href)
        if (url.pathname == '/payment' ){
            store.dispatch({
                type: e_actions.init,
                payment: {
                    coffee: coffies[parseInt(url.searchParams.get('coffee_id'))],
                    deposit: 0
                }
            })
        } else {
            store.dispatch({
                type: e_actions.init,
                payment: {coffies}
            })
        }

    }
    return store
}

export default {
    getStore
}