import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useReducer,
} from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Platform,
  Alert,
  KeyboardAvoidingView,
  ActivityIndicator,
  Text,
} from "react-native";

import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useSelector, useDispatch } from "react-redux";

import Picker from "../../components/categories/Picker";
import * as productsActions from "../../store/actions/Chefproducts";
import HeaderButton from "../../components/UI/HeaderButton";
import ImagePicker from "../../components/ImagePicker";
import Input from "../../components/UI/Input";
import Colors from "../../constants/Colors";
import theContext from "../../components/categories/theContext";

const FORM_INPUT_UPDATE = "FORM_INPUT_UPDATE";

const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value,
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid,
    };
    let updatedFormIsValid = true;
    for (const key in updatedValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    }
    return {
      formIsValid: updatedFormIsValid,
      inputValidities: updatedValidities,
      inputValues: updatedValues,
    };
  }
  return state;
};

const categories = [
  {
    backgroundColor: "#fc5c65",
    // icon: "pizza",
    label: "Fast Food",
    value: 1,
  },
  {
    backgroundColor: "#fd9644",
    // icon: "food-fork-drink",
    label: "Desi",
    value: 2,
  },
  {
    backgroundColor: "#fed330",
    // icon: "bowl",
    label: "Chinese",
    value: 3,
  },
  {
    backgroundColor: "#26de81",
    // icon: "fish",
    label: "Sea Food",
    value: 4,
  },
  {
    backgroundColor: "#2bcbba",
    // icon: "food-variant",
    label: "Continental",
    value: 5,
  },
  {
    backgroundColor: "#45aaf2",
    // icon: "food",
    label: "Turkish",
    value: 6,
  },
  {
    backgroundColor: "#4b7bec",
    // icon: "baguette",
    label: "Cakes and Bakery",
    value: 7,
  },
  {
    backgroundColor: "#a55eea",
    // icon: "cake-variant",
    label: "Desserts",
    value: 8,
  },
  {
    backgroundColor: "#778ca3",
    // icon: "application",
    label: "Other",
    value: 9,
  },
];

const EditProductScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [selectedImage, setSelectedImage] = useState();

  const { CatProvide } = useContext(theContext);
  const prodId = props.navigation.getParam("productId");
  const editedProduct = useSelector((state) =>
    state.chefproducts.userProducts.find((prod) => prod.id === prodId)
  );
  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      title: editedProduct ? editedProduct.title : "",
      // imageUrl: editedProduct ? editedProduct.imageUrl : "",
      // category: editedProduct ? editedProduct.category : "",
      description: editedProduct ? editedProduct.description : "",
      price: editedProduct ? editedProduct.price : "",
    },
    inputValidities: {
      title: editedProduct ? true : false,
      // imageUrl: editedProduct ? true : false,
      // category: editedProduct ? editedProduct.category : null,
      description: editedProduct ? true : false,
      price: editedProduct ? true : false,
    },
    formIsValid: editedProduct ? true : false,
  });

  useEffect(() => {
    if (error) {
      Alert.alert("An error occurred!", error, [{ text: "Okay" }]);
    }
  }, [error]);

  const submitHandler = useCallback(async () => {
    if (!formState.formIsValid) {
      Alert.alert("Wrong input!", "Please check the errors in the form.", [
        { text: "Okay" },
      ]);
      return;
    }
    setError(null);

    setIsLoading(true);
    try {
      if (editedProduct) {
        await dispatch(
          productsActions.updateProduct(
            prodId,
            formState.inputValues.title,
            formState.inputValues.description,
            +formState.inputValues.price,
            CatProvide
          )
        );
      } else {
        await dispatch(
          productsActions.createProduct(
            formState.inputValues.title,
            formState.inputValues.description,
            selectedImage,
            +formState.inputValues.price,
            CatProvide
          )
        );
      }
      props.navigation.goBack();
    } catch (err) {
      setError(err.message);
    }

    setIsLoading(false);
  }, [dispatch, prodId, formState]);

  useEffect(() => {
    props.navigation.setParams({ submit: submitHandler });
  }, [submitHandler]);

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier,
      });
    },
    [dispatchFormState]
  );

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const imageTakenHandler = (imagePath) => {
    setSelectedImage(imagePath);
  };
  const selectImage = (imagePath) => {
    setSelectedImage(imagePath);
  };
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={100}
    >
      <ScrollView>
        <View style={styles.form}>
          <View style={styles.title}>
            <Input
              id="title"
              label="Title"
              errorText="Please enter a valid title!"
              keyboardType="default"
              autoCapitalize="sentences"
              autoCorrect
              returnKeyType="next"
              onInputChange={inputChangeHandler}
              initialValue={editedProduct ? editedProduct.title : ""}
              initiallyValid={!!editedProduct}
              required
            />
          </View>
          {editedProduct == null ? (
            <ImagePicker  onSelectImage={selectImage}  onImageTaken={imageTakenHandler} />
          ) : (
            <></>
          )}
          {editedProduct == null ? (
            <Picker
              items={categories}
              name="category"
              // numberOfColumns={3}
              // PickerItemComponent={CategoryPickerItem}
              placeholder="Category"
              width="50%"
            />
          ) : (
            <>
              <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                Current Category:{" "}
                <Text style={{ color: "green" }}>{editedProduct.category}</Text>
              </Text>
              <Picker
                items={categories}
                name="category"
                // numberOfColumns={3}
                // PickerItemComponent={CategoryPickerItem}
                placeholder="Category"
                width="50%"
              />
                <Text style={{ fontSize: 15, fontWeight: "bold" }}>
            Current Price:{" "}
            <Text style={{ color: "green" }}>{editedProduct.price}</Text>
          </Text>

            </>
          )}
        
          <Input
            id="price"
            label="Price"
            errorText="Please enter a valid price!"
            keyboardType="decimal-pad"
            returnKeyType="next"
            onInputChange={inputChangeHandler}
            required
            min={1}
          />

          <Input
            id="description"
            label="Description"
            errorText="Please enter a valid description!"
            keyboardType="default"
            autoCapitalize="sentences"
            autoCorrect
            multiline
            numberOfLines={3}
            onInputChange={inputChangeHandler}
            initialValue={editedProduct ? editedProduct.description : ""}
            initiallyValid={!!editedProduct}
            required
            minLength={5}
          />
          <View style={styles.noteContainer}>
            <Text style={styles.note}>Note: </Text>
            <Text style={styles.noteDesc}>
              If you don't select a category, your Product will not been shown
              in Categories section!
            </Text>
            <Text style={styles.noteDesc}>
              This Platform is made for your benifit! Be careful in what you
              Submit.
            </Text>
        
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

EditProductScreen.navigationOptions = (navData) => {
  const submitFn = navData.navigation.getParam("submit");
  return {
    headerTitle: navData.navigation.getParam("productId")
      ? "Edit Product"
      : "Add Product",
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Save"
          iconName={
            Platform.OS === "android" ? "md-checkmark" : "ios-checkmark"
          }
          onPress={submitFn}
        />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({
  form: {
    margin: 20,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    paddingVertical: 20,
  },
  noteContainer: {
    padding: "5%",
  },
  note: {
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
    color: "red",
    marginBottom: "3%",
  },
  noteDesc: {
    fontSize: 14,
    padding: 5,
  },
});

export default EditProductScreen;
