import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Ionicons , MaterialCommunityIcons } from "@expo/vector-icons";
import { Calendar } from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ScheduleScreen() {
  const [selected, setSelected] = useState("2077-10-05");

  return (
    <SafeAreaView style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color="black" />
        <Text style={styles.headerTitle}>Study Schedule</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <View style={styles.tabButton}>
          <Text style={[styles.tabText, styles.activeTabText]}>Timeline</Text>
          <View style={styles.activeLine} />
        </View>

        <View style={styles.tabButton}>
          <Text style={styles.tabText}>List</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* REAL CALENDAR */}
        <View style={styles.calendarBox}>
          <Calendar
            initialDate={"2077-10-05"}
            onDayPress={(day) => setSelected(day.dateString)}
            markedDates={{
              [selected]: {
                selected: true,
                selectedColor: "#2A74F5",
                selectedTextColor: "white",
              },
            }}
            theme={{
              todayTextColor: "#2A74F5",
              arrowColor: "#2A74F5",
              selectedDayBackgroundColor: "#2A74F5",
              selectedDayTextColor: "#fff",
              textDayFontSize: 15,
              textMonthFontSize: 16,
              textMonthFontWeight: "bold",
              textDayHeaderFontSize: 13,
            }}
            style={{
              borderRadius: 12,
              elevation: 2,
            }}
          />
        </View>

        {/* Today Section */}
        <Text style={styles.todayTitle}>Today</Text>

        <TaskCard title="Math Review" time="9:00 AM - 10:00 AM" type={"book-outline"} />
        <TaskCard title="History Quiz" time="11:00 AM - 12:00 PM" type={"test-tube-empty"} />
        <TaskCard title="Science Practice" time="2:00 PM - 3:00 PM" type={"pencil-outline"} />

      </ScrollView>

      {/* Floating Add Button */}
      <TouchableOpacity style={styles.addButton}>
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

/* Task Component */
function TaskCard({ title, time , type}) {
  if (type == "book-outline"){
    return (
      <View style={styles.taskCard}>
        <Ionicons name={type} size={24} color="#4A90E2" />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.taskTitle}>{title}</Text>
          <Text style={styles.taskTime}>{time}</Text>
        </View>
      </View>
    );
  } else if (type == "test-tube-empty" || type == "pencil-outline"){
    return (
      <View style={styles.taskCard}>
        <MaterialCommunityIcons name={type} size={24} color="#4A90E2" />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.taskTitle}>{title}</Text>
          <Text style={styles.taskTime}>{time}</Text>
        </View>
      </View>
    );
  }
}

/* Styles */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F9FC" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    justifyContent: "space-between",
  },
  headerTitle: { fontSize: 20, fontWeight: "600" },

  tabsContainer: { flexDirection: "row", justifyContent: "center" },
  tabButton: { alignItems: "center", marginHorizontal: 40 },
  tabText: { fontSize: 16, color: "#666" },
  activeTabText: { color: "#2A74F5", fontWeight: "600" },
  activeLine: {
    marginTop: 5,
    height: 3,
    width: "100%",
    backgroundColor: "#2A74F5",
    borderRadius: 2,
  },

  calendarBox: {
    height : 350,
    marginTop: 20,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: "hidden",
  },

  todayTitle: {
    marginTop: 25,
    marginLeft: 16,
    fontSize: 18,
    fontWeight: "600",
  },

  taskCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    marginHorizontal: 16,
    backgroundColor: "white",
    borderRadius: 12,
    marginTop: 12,
  },
  taskTitle: { fontSize: 15, fontWeight: "600" },
  taskTime: { fontSize: 13, color: "#666" },

  addButton: {
    position: "absolute",
    bottom: 30,
    right: 25,
    backgroundColor: "#2A74F5",
    width: 55,
    height: 55,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
});

