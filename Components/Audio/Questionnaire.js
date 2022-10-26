/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { View, Text, TextInput, Platform } from 'react-native';
// import { Button } from '../';
import Button from '../Button/Button';
import PropTypes from 'prop-types';

const Questionnaire = props => {
    const {
        styles,
        multiLine,
        realConfusing,
        questionnaire,
        realOtherQuestion,
        sendQuestionnaire,
        store,
        anythingElse,
        dark
    } = props;

    const [localQuestion = '', setQuestion] = useState();
    const [localConfusing = '', setConfusing] = useState();
    const [localComment = '', setComment] = useState();
    return (
        <View style={styles.textScrollView}>
            <Text style={dark ? styles.questionnaireLabelDark : styles.questionnaireLabel}>{realConfusing}</Text>
            <TextInput
                id="confusing"
                multiline={multiLine}
                value={localConfusing}
                style={dark ? styles.questionareTextDark : styles.questionareText}
                onChangeText={(text) => {
                    setConfusing(text);
                }}
                onBlur={() => {
                    questionnaire.confusing = localConfusing;
                    store({ questionnaire });
                }}
            />
            <Text style={dark ? styles.questionnaireLabelDark : styles.questionnaireLabel}>{realOtherQuestion}</Text>
            <TextInput
                id="question"
                multiline={multiLine}
                value={localQuestion}
                style={dark ? styles.questionareTextDark : styles.questionareText}
                onChangeText={(text) => {
                    setQuestion(text);
                }
                }
                onBlur={() => {
                    questionnaire.question = localQuestion;
                    store({ questionnaire });
                }}
            />

            <Text style={dark ? styles.questionnaireLabelDark : styles.questionnaireLabel}>{anythingElse}</Text>
            <TextInput
                id="comment"
                multiline={multiLine}
                value={localComment}
                style={dark ? styles.questionareTextDark : styles.questionareText}
                onChangeText={(text) => {
                    setComment(text);
                }
                }
                onBlur={() => {
                    questionnaire.comment = localComment;
                    store({ questionnaire });
                }}
            />

            <View style={Platform.OS === "ios" ? styles.altButtonContainer : styles.buttonContainer}>
                <Button
                    dark={dark}
                    title={"Submit"}
                    onPress={() => {
                        sendQuestionnaire().then(res => {
                            if (res === 'sent') {
                                setComment('');
                                setConfusing('');
                                setQuestion('');
                            }
                        });
                    }}
                />
            </View>
        </View>
    )
}

Questionnaire.propTypes = {
    styles: PropTypes.object.isRequired
}

export default Questionnaire;