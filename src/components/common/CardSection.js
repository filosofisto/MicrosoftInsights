import React from 'react';
import { View } from 'react-native';

const CardSection = (props) => {
  const customStyles = { ...styles.containerStyle, ...props.styles };

  return (
    <View style={customStyles}>
      {props.children}
    </View>
  );
};

const styles = {
  containerStyle: {
    borderBottomWidth: 1,
    padding: 5,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    borderColor: '#ddd',
    position: 'relative'
  }
};

export { CardSection };
