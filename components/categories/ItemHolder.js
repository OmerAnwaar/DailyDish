import React from 'react'
import {Text,View, FlatList} from 'react-native'

function ItemHolder({data}) {
    return (
       <View>
<FlatList
data={data}
keyExtractor={data=>data.id}
renderItem={({item})=>(
    <>
<Text> Product : {item.productTitle} </Text>
<Text> Product Price : {item.productPrice}{" "}<Text>Quantity: {item.quantity}</Text></Text>
</>
)}

/>
       </View>
        
    )
}

export default ItemHolder
