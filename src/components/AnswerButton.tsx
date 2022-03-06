import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
} from 'react-native';

export interface CustomProps {
    title: string,
    onPress?: () => void,
}

class AnswerButton extends React.Component<CustomProps> {
    render() {
        const { title } = this.props;
        return (
            <TouchableOpacity style={styles.touchcontainer} onPress={this.props.onPress}>
                <Text style={styles.answerText}>{title}</Text>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    touchcontainer: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: 'white',
        borderRadius: 18,
        margin: 8,
        shadowColor: "black",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8
    },
    answerText: {
        color: '#3b6c82',
        fontWeight: 'bold',
        fontSize: 18
    }
})

export default AnswerButton;