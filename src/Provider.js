import React, { Component } from 'react'
import axios from "axios"
const { Provider, Consumer } = React.createContext()

class DataProvider extends Component {
    constructor() {
        super()
        this.state = {
            cuisines: [],
            restaurants: [],
            luckyRestaurant: ''
        }
    }

    getCuisines = () => {
        axios.get('https://developers.zomato.com/api/v2.1/cuisines?city_id=1213', { headers: { "user-key": `${process.env.REACT_APP_KEY}` } }).then(res => {
            this.setState({
                cuisines: res.data.cuisines
            })
        })
    }
    
    getRestaurants = (cuisineKey) => {
        axios.get(`https://developers.zomato.com/api/v2.1/search?entity_id=1213&entity_type=city&cuisines=${cuisineKey}`, { headers: { "user-key": `${process.env.REACT_APP_KEY}` } }).then(res => {
            this.setState({
                restaurants: res.data.restaurants
            })
        })
    }

    luckyRestaurants = (key) => {
        axios.get(`https://developers.zomato.com/api/v2.1/search?entity_id=1213&entity_type=city&cuisines=${key}`, { headers: { "user-key": `${process.env.REACT_APP_KEY}` } }).then(res => {
            this.setState({
                luckyRestaurant: res.data.restaurants[Math.floor(Math.random()*res.data.restaurants.length)].restaurant
            })
        })
    }
    
    render() {
        return (
            <Provider value={{
                getCuisines: this.getCuisines,
                getRestaurants: this.getRestaurants,
                luckyRestaurants: this.luckyRestaurants,
                ...this.state
            }}
            >
                {this.props.children}
            </Provider>
        )
    }
}
export default DataProvider

export function withData(C) {
    return props => <Consumer>
        {value => <C {...value}{...props} />}
    </Consumer>
}