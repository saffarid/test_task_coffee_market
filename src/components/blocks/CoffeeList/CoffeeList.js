import React from "react";
import {CoffeeItem} from "../../elements/CoffeeItem/coffeeItem";

export class CoffeeList extends React.Component {

    constructor(props, context) {
        super(props, context);
    }

    render() {
        return <table className={'coffee-list'}
        >
            <tbody>
            {this.props.coffies.map((coffee) => <CoffeeItem coffee={coffee} key={coffee.id}/>)}
            </tbody>
        </table>
    }
}