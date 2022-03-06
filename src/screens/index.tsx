import React from 'react';
import {
    TouchableOpacity,
    View,
    Text,
    StyleSheet,
    Modal,
    FlatList,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import AnswerButton from '../components/AnswerButton';

type QuizDict = {
    en_answer: string,
    ge_answer: string,
    question_en: string,
    question_ge: string,
    query_array: Array<string>,
};


export interface Props {
    isAnswer: Boolean,
    isContinue: Boolean,
    isCorrect: Boolean,
    CorrectAnswerTitle: string,
    answerTitle: string,
    queryindex?: number,
    queryList: Array<QuizDict>,
}

interface State {
    isAnswer: Boolean;
    isContinue: Boolean;
    isCorrect: Boolean;
    CorrectAnswerTitle: string;
    answerTitle: string;
    queryindex: number;
    queryList: Array<QuizDict>;
}


class StartScreen extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            isAnswer: props.isAnswer || false,
            isContinue: props.isContinue || false,
            isCorrect: props.isCorrect || false,
            CorrectAnswerTitle: props.CorrectAnswerTitle || '',
            answerTitle: props.answerTitle || '',
            queryindex: props.queryindex || 0,
            queryList: props.queryList || [],
        }
        this.onAnswerHandle = this.onAnswerHandle.bind(this);
        this.onContinue = this.onContinue.bind(this);
        this.onContinueNext = this.onContinueNext.bind(this);
    }

    componentDidMount() {
        const ref = firestore().collection('quiz');
        ref.onSnapshot((querySnapshot: any) => {
            const list: any = [];
            querySnapshot?.forEach((doc: any) => {
                const { correct_answer_en, correct_answer_ge, question_en, question_ge, answers } = doc.data();
                list.push({
                    en_answer: correct_answer_en,
                    ge_answer: correct_answer_ge,
                    question_en,
                    question_ge,
                    query_array: answers,
                });
            });
            this.setState({ queryList: list });
        });
    }

    onAnswerHandle(title: string) {
        const { queryList, queryindex } = this.state;
        const initQuery = queryList[queryindex];
        const answer_title = initQuery.ge_answer;
        if (answer_title == title) {
            this.setState({ isAnswer: true, answerTitle: title, isCorrect: true, CorrectAnswerTitle: '' });
        } else {
            this.setState({ isAnswer: true, answerTitle: title, isCorrect: false, CorrectAnswerTitle: 'Answer: ' + answer_title });
        }
    }

    onContinue() {
        this.setState({ isContinue: true });
    }

    onContinueNext() {
        let index = this.state.queryindex + 1;
        if (index == this.state.queryList.length) index = 0;

        this.setState({
            isContinue: false,
            isAnswer: false,
            answerTitle: '',
            isCorrect: false,
            CorrectAnswerTitle: '',
            queryindex: index
        });
    }

    render() {
        const { isAnswer, answerTitle, isContinue, isCorrect, CorrectAnswerTitle, queryindex, queryList } = this.state;
        let answer_list: Array<string> = [];
        let question_en_split: Array<string> = [];
        let question_ge_split: Array<string> = [];

        let initQuery = queryList[queryindex];
        if (initQuery != undefined) {
            initQuery.query_array.map(item => {
                answer_list.push(item);
            })

            question_en_split = initQuery.question_en.split('####');
            question_ge_split = initQuery.question_ge.split('####');
        }

        return (
            <View style={styles.container}>
                <Text style={styles.smallTitle}>Fill in the missing word</Text>
                <View style={styles.answertextcontainer}>
                    <Text style={styles.answerSectionTxt}>{question_en_split.length == 0 ? '' : question_en_split[0]}</Text>
                        <Text style={[styles.underlineTextStyle, styles.enAnswer]}>{' '+ initQuery?.en_answer + ' '}</Text>
                    <Text style={styles.answerSectionTxt}>{question_en_split.length == 0 ? '' : question_en_split[1]}</Text>
                </View>

                <View style={[styles.answertextcontainer, { marginVertical: 30 }]}>
                    <Text style={styles.answerSectionTxt}>{question_ge_split.length == 0 ? '' : question_ge_split[0]}</Text>
                    {
                        isAnswer ?
                            <View style={
                                [styles.answertext, { borderRadius: 18 }, isContinue ? (isCorrect ? styles.geCorrectAnswer : styles.geWrongAnswer)
                                    : { backgroundColor: 'white' }]}>
                                <Text style={[styles.geAnswertext, isContinue ? { color: 'white' } : {}
                                    ]}>{answerTitle}</Text>
                            </View>
                            :
                            <View style={styles.answertext}>
                                <Text style={styles.underlineTextStyle}>{"         "}</Text>
                            </View>
                    }
                    <Text style={styles.answerSectionTxt}>{question_ge_split.length == 0 ? '' : question_ge_split[1]}</Text>
                </View>
                <FlatList
                    data={answer_list}
                    numColumns={2}
                    renderItem={({ item, index }: {item: string; index: number;}) => (
                        answerTitle != item ?
                            <AnswerButton key={index} onPress={() => this.onAnswerHandle(item)} title={item} />
                            : <View style={[styles.touchcontainer, { backgroundColor: '#6291A6' }]}>
                                <Text style={{ color: '#6291A6' }}>{item}</Text>
                            </View>
                    )
                    }
                />
                <TouchableOpacity style={[styles.checkbtncontainer, { backgroundColor: isAnswer ? '#22E3EA' : '#6392A6' }]} disabled={!isAnswer} onPress={this.onContinue}>
                    <Text style={[styles.checkbtnTxt, { color: 'white' }]}>{isAnswer ? 'CHECK ANSWER' : 'CONTINUE'}</Text>
                </TouchableOpacity>
                {
                    isContinue &&
                    <Modal
                        animationType={'slide'}
                        transparent={true}>
                        <View style={[styles.answerbottom, { backgroundColor: isCorrect ? '#01E0E7' : '#FF7B88' }]}>
                            <Text style={{ color: 'white', fontWeight: 'bold' }}>{isCorrect ? "Great a Job" : CorrectAnswerTitle}</Text>
                            <TouchableOpacity style={styles.answerbottombtn} onPress={this.onContinueNext}>
                                <Text style={[styles.checkbtnTxt, { color: isCorrect ? '#01E0E7' : '#FF7B88' }]}>{'CONTINUE'}</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>

                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#3b6c82',
        paddingVertical: 30,
        alignItems: 'center'
    },
    smallTitle: {
        color: 'white',
        textAlign: 'center',
        marginBottom: 30,
        fontSize: 12
    },
    answerSectionTxt: {
        color: 'white',
        textAlign: 'center',
        fontSize: 24
    },
    answercontainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
        marginVertical: 10
    },
    answertextcontainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    touchcontainer: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: 'white',
        borderRadius: 18,
        margin: 8
    },
    answertext: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        marginHorizontal: 5
    },
    checkbtncontainer: {
        position: 'absolute',
        width: '80%',
        borderRadius: 20,
        height: 50,
        bottom: 50,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: 'black',
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8
    },
    underlineTextStyle: {
        textDecorationLine: 'underline',
        color: 'white',
        fontSize: 24,
    },
    checkbtnTxt: {
        textAlign: 'center',
        color: 'white',
        fontSize: 15
    },
    answerbottom: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 30,
        paddingVertical: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        zIndex: 100
    },
    answerbottombtn: {
        width: '100%',
        borderRadius: 20,
        marginTop: 20,
        marginBottom: 30,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        shadowColor: 'black',
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8
    },
    enAnswer: {
        fontWeight: 'bold',
        fontSize: 24,
        color: 'white'
    },
    geAnswertext: {
        color: '#3b6c82',
        fontWeight: 'bold',
        fontSize: 18
    },
    geCorrectAnswer: {
        backgroundColor: '#01E0E7',
        shadowColor: 'black',
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8        
    },
    geWrongAnswer: {
        backgroundColor: '#FF7B88',
        shadowColor: 'black',
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8        
    }
})

export default StartScreen;