import React, { useState, useEffect } from "react";
import { db } from "../../firebase/Firebase";
import { Text } from "react-native";
import { useSelector, useDispatch } from "react-redux";

function UserName({NameUser}) {
  return <Text>{NameUser}</Text>;
}

export default UserName;
