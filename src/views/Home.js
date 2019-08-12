import React, {Component} from 'react';
import {connect} from 'react-redux';
import {View, Text} from 'react-native';
import {Button, CardSection} from '../components/common';
import {customTraceAction} from '../actions';

class Home extends Component {

    renderMessage() {
        if (this.props.message) {
            return (
                <CardSection>
                    <Text style={styles.messageStyle}>{this.props.message}</Text>
                </CardSection>
            );
        }

        return null;
    }

    render() {
        return (
            <View style={styles.container}>
                <CardSection styles={styles.customCardHeader}>
                    <Text style={styles.textTitle}>
                        Microsoft Insights
                    </Text>
                </CardSection>
                <CardSection styles={styles.customCard}>
                    <Button onPress={() => this.props.customTraceAction('bingo')}>
                        Custom Trace
                    </Button>
                </CardSection>
                {this.renderMessage()}
            </View>
        );
    }
}

const styles = {
    container: {
        flex: 1,
    },
    textTitle: {
        fontSize: 24,
    },
    customCardHeader: {
        backgroundColor: 'yellow',
        padding: 50,
    },
    customCard: {
        backgroundColor: 'orange',
        padding: 50,
    },
    messageStyle: {
        fontColor: 'green',
    },
};

const mapStateToProps = storeState => {
    const { message, insightsResult, loading } = storeState.insights;
    return { message, insightsResult, loading };
};

export default connect(mapStateToProps, { customTraceAction })(Home);

