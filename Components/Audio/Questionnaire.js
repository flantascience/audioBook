import React from 'react';
import { View, Text, TextInput } from 'react-native';
import Button from '../Button/Button';
import PropTypes from 'prop-types';

const Questionnaire = props => {
    const { 
        styles, 
        multiLine, 
        confusing, 
        realConfusing, 
        questionnaire, 
        question, 
        realOtherQuestion, 
        sendQuestionnaire,
        store,
        titleText,
        anythingElse,
        comment
    } = props;
    return (
        <View style = { styles.textScrollView }>
            <Text style={ styles.questionnaireTitle }>{ titleText }</Text>
            <Text style={ styles.questionnaireLabel }>{ realConfusing }</Text>
            <TextInput
                id="confusing"
                multiline = { multiLine }
                value={ confusing }
                style={ styles.questionareText}
                onChangeText={ (text) =>{
                    questionnaire.confusing = text;
                    store({ questionnaire });
                } }
            />
            <Text style={ styles.questionnaireLabel }>{ realOtherQuestion }</Text>
            <TextInput
                id="question"
                multiline = { multiLine }
                value={ question }
                style={ styles.questionareText}
                onChangeText={
                    (text) =>{
                        questionnaire.question = text;
                        store({ questionnaire });
                    }
                }
            />

            <Text style={ styles.questionnaireLabel }>{ anythingElse }</Text>
            <TextInput
                id="comment"
                multiline = { multiLine }
                value={ comment }
                style={ styles.questionareText}
                onChangeText={
                    (text) =>{
                        questionnaire.comment = text;
                        store({ questionnaire });
                    }
                }
            />
            
            <View style = { Platform.OS === "ios"?styles.altButtonContainer:styles.buttonContainer }>
                <Button
                    title={ "Submit" }
                    onPress={ sendQuestionnaire } 
                />
            </View>
        </View>
    )
}

Questionnaire.propTypes = {
    styles: PropTypes.object.isRequired
}

export default Questionnaire;