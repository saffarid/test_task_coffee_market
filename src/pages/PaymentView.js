import React from "react";
import {connect} from "react-redux";
import actions from "../store/actions";

import {Terminal} from "../components/blocks/Terminal/Terminal";
import {paymentMode} from "../js/paymentMode";


class PaymentView extends React.Component {


    render() {
        return <div>
            <span>Окно оплаты</span>
            <div>
                <table>
                    <tbody>
                    <tr>
                        <th colSpan={2}>
                            Ваш выбор
                        </th>
                    </tr>
                    <tr>
                        <td>Кофе</td>
                        <td>{this.props.coffee.name}</td>
                    </tr>
                    <tr>
                        <td>Цена</td>
                        <td>{this.props.coffee.price}</td>
                    </tr>
                    <tr>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>Внесённый депозит</td>
                        <td>{parseFloat(this.props.deposit).toFixed(2)}</td>
                    </tr>
                    </tbody>
                </table>

                <Terminal addDeposit={this.props.addDeposit} changePaymentMode={this.props.changePaymentMode}/>
            </div>

        </div>
    }
}

function mapStateToProps(state) {
    return {
        coffee: state.get("coffee"),
        deposit: state.get("deposit"),
    };
}

export const PaymentView_w = connect(mapStateToProps, actions)(PaymentView);