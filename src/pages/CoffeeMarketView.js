import React from "react";
import {connect} from "react-redux"
import actions from './../store/actions'

import {CoffeeList} from "../components/blocks/CoffeeList/CoffeeList";

class CoffeeMarket extends React.Component{

  render() {
    return <div>CoffeeMarket
      <CoffeeList coffies={this.props.coffies}/>
    </div>
  }
}


function mapStateToProps(state) {
  return {
    coffies: state.get("coffies")
  };
}

export const CoffeeMarket_w = connect(mapStateToProps, actions)(CoffeeMarket);