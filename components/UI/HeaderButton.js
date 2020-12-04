import React from 'react';
import { Platform } from 'react-native';
import { HeaderButton } from 'react-navigation-header-buttons';
import { Ionicons } from '@expo/vector-icons';

import Colors from '../../constants/Colors';

const CustomHeaderButton = props => {
  return (
    <HeaderButton
      {...props}
      IconComponent={Ionicons}
      iconSize={23}
<<<<<<< Updated upstream
      color={Platform.OS === 'android' ? 'white' : Colors.primary}
=======
  color={Platform.OS === 'android' ? 'white' : '#636e72'}
      
>>>>>>> Stashed changes
    />
  );
};

export default CustomHeaderButton;
