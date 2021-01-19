import React,{useState, useEffect} from "react";
import { View, Text, StyleSheet } from "react-native";
import {Pedometer} from "expo-sensors"

import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../../components/UI/HeaderButton";


const VoucherScreen = (props) => {
  const [Currsteps, setCurrsteps] = useState(0)
 const [pastSteps, setpastSteps] = useState(0)
 const [availaible, setavailaible] = useState("checking")
 let subscription
  const _subscribe = () => {
  subscription = Pedometer.watchStepCount(result => {
     setCurrsteps(result.steps)
    });

    Pedometer.isAvailableAsync().then(
      result => {
       setavailaible(String(result))
      },
      error => {
        this.setState({
          isPedometerAvailable: 'Could not get isPedometerAvailable: ' + error,
        });
      }
    );

    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 1);
    Pedometer.getStepCountAsync(start, end).then(
      result => {
        setpastSteps(result.steps)
      },
      error => {
       console.log(error)
      }
    );
  };

  useEffect(() => {
    _subscribe()
    return () => {
      _unsubscribe()
    }
  }, [])

 const  _unsubscribe = () => {
    subscription && subscription.remove();
    subscription = null;
  };
  return (
    <View style={styles.container}>
        <Text>Pedometer.isAvailableAsync(): {availaible}</Text>
        <Text>Steps taken in the last 24 hours: {pastSteps}</Text>
        <Text>Walk! And watch this go up: {Currsteps}</Text>
      </View>
  );
};

VoucherScreen.navigationOptions = (navData) => {
  return {
    headerTitle: "Vouchers",
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Menu"
          iconName={Platform.OS === "android" ? "md-menu" : "ios-menu"}
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({
  screen: {
    justifyContent: "center",
    alignContent: "center",
  },
});

export default VoucherScreen;
