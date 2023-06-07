import immutable from 'immutable'
import {e_actions} from "./e_actions";

const Map = immutable.Map

const init = (state, payment) => {
    console.log({...payment})
    return state.merge({
        ...payment
    })
}

const changePaymentMode = (state, paymentMode) => {
    return state.update('paymentMode', () =>  paymentMode)
}

const addDeposit = (state, _deposit) => {
    return state.update('deposit', (deposit) =>  deposit + _deposit)
}

export const reducer = (state = Map(), action) => {
    switch (action.type) {
        case e_actions.init:
            return init(state, action.payment)
        case e_actions.changePaymentMode:
            return changePaymentMode(state, action.paymentMode)
        case e_actions.addDeposit:
            return addDeposit(state, action.deposit)
    }
    return state
}