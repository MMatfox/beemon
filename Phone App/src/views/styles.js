import { StyleSheet, Dimensions, Platform } from 'react-native';
const { height } = Dimensions.get('window');

export default StyleSheet.create({
  safe:{flex:1},
  sv:{padding:10,paddingBottom:40},
  no:{flex:1,justifyContent:'center',alignItems:'center',padding:20,marginTop:height*0.15},
  noTxt:{fontSize:18,fontWeight:'600',textAlign:'center',marginBottom:8},
  noSub:{fontSize:14,textAlign:'center',marginBottom:20},
  fab:{position:'absolute',borderRadius:28,width:56,height:56,justifyContent:'center',alignItems:'center',
       shadowColor:'#000',shadowOffset:{width:0,height:2},shadowOpacity:0.25,shadowRadius:3.84,elevation:5},
  fabTheme:{bottom:20,left:20},
  fabSet:{bottom:20,right:20},
});
