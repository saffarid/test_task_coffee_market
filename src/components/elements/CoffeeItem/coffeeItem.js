import React from "react";

export class CoffeeItem extends React.Component{

    constructor(props, context) {
        super(props, context);
        this.payment = this.toPayment.bind(this)
    }

    toPayment() {
        console.log(this.props.coffee)
        const url = new URL(location.href)
        url.searchParams.append('coffee_id', this.props.coffee.id)
        url.pathname = '/payment'
        location.replace(url.href)
    }


    render() {
        return <tr onClick={this.payment}>
            <td>{this.props.coffee.name}</td>
            <td>{this.props.coffee.price} р</td>
        </tr>
    }
}