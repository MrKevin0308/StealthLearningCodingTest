import React from 'react';
import {
    Scene,
    Router,
    Stack,
  } from 'react-native-router-flux';

import StartScreen from '../screens';



class Navigation extends React.Component{
    
    render(){
        return(
            <Router>
                <Stack key="root">
                    <Scene key='start' component={StartScreen} hideNavBar initial/>                   
                </Stack>
            </Router>
        )
    }
}


export default Navigation