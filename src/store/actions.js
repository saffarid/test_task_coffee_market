import {e_actions} from "./e_actions";

const addDeposit = (deposit) => {
    return {
        type: e_actions.addDeposit,
        deposit
    }
}

const changePaymentMode = (paymentMode) => {
    return {
        type: e_actions.changePaymentMode,
        paymentMode
    }
}

export default {
    addDeposit,
    changePaymentMode
}