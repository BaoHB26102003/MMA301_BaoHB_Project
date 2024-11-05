import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Linking } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

export default function AboutScreen({navigation}) {
  return (
    <ScrollView style={styles.aboutSection}>
      <Text style={styles.heading}>About Us</Text>
      <View style={styles.membersSection}>
        <View style={styles.memberContainer}>
          <Image source={require('../database/images/BaoBao.jpg')} style={styles.avatar} />
          <Text style={styles.name}>Hồng Bảo Bảo</Text>
        </View>

        <View style={styles.memberContainer}>
          <Image source={require('../database/images/BinhTri.jpg')} style={styles.avatar} />
          <Text style={styles.name}>Hà Nguyễn Bình Trị</Text>
        </View>
      </View>
        <View style={styles.memberContainer}>
          <Image source={require('../database/images/ThanhDuy.jpg')} style={styles.avatar} />
          <Text style={styles.name}>Hồ Thanh Duy</Text>
          <Text style={styles.role}>(Leader)</Text>
        </View>

        <View style={styles.memberContainer}>
          <Image source={require('../database/images/ThiMay.jpg')} style={styles.avatar} />
          <Text style={styles.name}>Kim Thị Mây</Text>
        </View>

        <View style={styles.memberContainer}>
          <Image source={require('../database/images/ThanhPhuc.jpg')} style={styles.avatar} />
          <Text style={styles.name}>Nguyễn Thanh Phúc</Text>
        </View>

        <View style={styles.memberContainer}>
          <Image source={require('../database/images/AnhDuy.jpg')} style={styles.avatar} />
          <Text style={styles.name}>Nguyễn Anh Duy</Text>
        </View>
      

      {/* Social Media Section */}
      
      <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.backButton}>
        <Text style={styles.backButtonText}>Back to Home</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  aboutSection: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
 membersSection: {
  display: "flex",
  flex: 1,
  alignItems: 'center',
  justifyContent: "space-around",
  },

  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: 'center',
  },
  memberContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  role: {
    fontSize: 16,
    color: "grey",
  },
  socialMediaContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "60%",
    marginTop: 20,
  },
  subheading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: 'center',
  },
  backButton: {
    padding: 10,
    backgroundColor: '#FFEBCC',
    borderRadius: 20,
    marginBottom: 30,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});
