import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Calendar } from "react-native-calendars";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { getAllSchedules, createSchedule, updateScheduleById, deleteScheduleById } from "../services/scheduleService";
import { registerForPushNotificationsAsync, scheduleEventNotification, sendCreationNotification } from "../services/notificationService";
import { ScheduleType } from "../types/schedule";
import { useScheduleStore } from "../store/schedule";

export default function ScheduleScreen({ navigation }: any) {
  const [selected, setSelected] = useState(() => {
    const today = new Date();
    return today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
  });
  const [activeTab, setActiveTab] = useState<'Timeline' | 'List'>('Timeline');
  const [isLoading, setIsLoading] = useState(false);
  const [schedules, setSchedules] = useState<ScheduleType[]>([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [modalDate, setModalDate] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [editingScheduleId, setEditingScheduleId] = useState<string | null>(null);
  const [showTimePicker, setShowTimePicker] = useState<'start' | 'end' | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await getAllSchedules();
      if (res.status === 200) {
        setSchedules(res.data);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    registerForPushNotificationsAsync();
  }, [useScheduleStore.getState().schedules.length]);

  const handleCreateNewSchedule = () => {
    setEditingScheduleId(null);
    setShowTimePicker(null);
    setModalVisible(true);
    setModalDate(selected);
    setShowDatePicker(false);
    setTitle("");
    setDescription("");
  };

  const handleEdit = (item: ScheduleType) => {
    setEditingScheduleId(item.id);
    setTitle(item.title);
    setDescription(item.description);

    const startDate = new Date(item.start_date);
    const endDate = new Date(item.end_date);

    setModalDate(startDate.toISOString().split('T')[0]);

    const formatTime = (date: Date) => {
      return date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0');
    };

    setStartTime(formatTime(startDate));
    setEndTime(formatTime(endDate));

    setModalVisible(true);
    setShowDatePicker(false);
  };

  const handleDelete = async () => {
    if (!editingScheduleId) return;

    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this schedule?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setIsLoading(true);
            try {
              const res = await deleteScheduleById(editingScheduleId);
              if (res.status === 200) {
                // Update local state or refetch
                fetchData();
                Alert.alert("Success", "Schedule deleted successfully");
                setModalVisible(false);
                setEditingScheduleId(null);
              }
            } catch (error) {
              Alert.alert("Error", "Failed to delete schedule");
            } finally {
              setIsLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleSave = async () => {
    if (!title || !startTime || !endTime) {
      Alert.alert("Missing Fields", "Please fill in title and times.");
      return;
    }

    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);

    const startTotalMinutes = startHour * 60 + startMinute;
    const endTotalMinutes = endHour * 60 + endMinute;

    if (endTotalMinutes <= startTotalMinutes) {
      Alert.alert("Invalid Time", "End time must be later than start time.");
      return;
    }

    setIsSaving(true);
    try {
      // Construct date in local time
      const [year, month, day] = modalDate.split('-').map(Number);

      const startDateTime = new Date(year, month - 1, day, startHour, startMinute).getTime();
      const endDateTime = new Date(year, month - 1, day, endHour, endMinute).getTime();

      const scheduleData: any = {
        title,
        description,
        content: description,
        start_date: startDateTime,
        end_date: endDateTime,
      };

      let res;
      if (editingScheduleId) {
        res = await updateScheduleById(editingScheduleId, scheduleData);
        if (res.status === 200) {
          fetchData();
          await scheduleEventNotification(title, startDateTime);
          Alert.alert("Success", "Schedule updated successfully");
        }
      } else {
        res = await createSchedule(scheduleData);
        if (res.status === 200 || res.status === 201) {
          useScheduleStore.getState().addSchedule(res.data);
          await scheduleEventNotification(title, startDateTime);
          await sendCreationNotification(title);
          Alert.alert("Success", "Schedule created successfully");
        }
      }

      setModalVisible(false);
      setEditingScheduleId(null);
    } catch (error) {
      console.error("Failed to save schedule:", error);
      Alert.alert("Error", "Failed to save schedule");
    } finally {
      setIsSaving(false);
    }
  };


  const filteredSchedules = schedules.filter(item => {
    if (!item.start_date) return false;
    const d = new Date(item.start_date);
    const dateStr = d.toISOString().split('T')[0];
    return dateStr === selected;
  });


  const markedDates: any = {};
  schedules.forEach(item => {
    if (item.start_date) {
      const d = new Date(item.start_date);
      const dateStr = d.toISOString().split('T')[0];
      markedDates[dateStr] = {
        marked: true,
        dotColor: '#2A74F5'
      };
    }
  });


  if (selected) {
    markedDates[selected] = {
      ...markedDates[selected],
      selected: true,
      selectedColor: "#2A74F5",
      selectedTextColor: "white",
    };
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Study Schedule</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity style={styles.tabButton} onPress={() => setActiveTab('Timeline')}>
          <Text style={[styles.tabText, activeTab === 'Timeline' && styles.activeTabText]}>Timeline</Text>
          {activeTab === 'Timeline' && <View style={styles.activeLine} />}
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabButton} onPress={() => setActiveTab('List')}>
          <Text style={[styles.tabText, activeTab === 'List' && styles.activeTabText]}>List</Text>
          {activeTab === 'List' && <View style={styles.activeLine} />}
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {activeTab === 'Timeline' ? (
          <>
            <View style={styles.calendarBox}>
              <Calendar
                onDayPress={day => setSelected(day.dateString)}
                markedDates={markedDates}
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

            <Text style={styles.todayTitle}>
              {selected === new Date().toISOString().split('T')[0] ? "Today" : selected}
            </Text>

            {isLoading ? (
              <ActivityIndicator style={{ marginTop: 20 }} color="#2A74F5" />
            ) : filteredSchedules.length > 0 ? (
              filteredSchedules.map((item, index) => {
                const startDate = new Date(item.start_date);
                const endDate = new Date(item.end_date);

                const timeStr = `${startDate.getHours().toString().padStart(2, '0')}:${startDate.getMinutes().toString().padStart(2, '0')} - ${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;

                return (
                  <TouchableOpacity key={index} onPress={() => handleEdit(item)}>
                    <TaskCard
                      title={item.title}
                      time={timeStr}
                      type={"book-outline"}
                    />
                  </TouchableOpacity>
                )
              })
            ) : (
              <Text style={styles.emptyText}>No schedules for this day.</Text>
            )}
          </>
        ) : (
          <>
            <View style={{ marginTop: 20 }}>
              {isLoading ? (
                <ActivityIndicator style={{ marginTop: 20 }} color="#2A74F5" />
              ) : schedules.length > 0 ? (
                schedules
                  .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
                  .map((item, index, array) => {
                    const startDate = new Date(item.start_date);
                    const endDate = new Date(item.end_date);
                    const dateStr = startDate.toISOString().split('T')[0];

                    const prevItem = index > 0 ? array[index - 1] : null;
                    const prevDateStr = prevItem ? new Date(prevItem.start_date).toISOString().split('T')[0] : null;
                    const showDateHeader = dateStr !== prevDateStr;

                    const timeStr = `${startDate.getHours().toString().padStart(2, '0')}:${startDate.getMinutes().toString().padStart(2, '0')} - ${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;

                    return (
                      <TouchableOpacity key={index} onPress={() => handleEdit(item)}>
                        <View style={{ marginBottom: 8 }}>
                          {showDateHeader && (
                            <Text style={{ marginLeft: 16, fontSize: 14, fontWeight: 'bold', color: '#666', marginTop: 10, marginBottom: 2 }}>{dateStr}</Text>
                          )}
                          <TaskCard
                            title={item.title}
                            time={timeStr}
                            type={"book-outline"}
                          />
                        </View>
                      </TouchableOpacity>
                    )
                  })
              ) : (
                <Text style={styles.emptyText}>No schedules found.</Text>
              )}
            </View>
          </>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      <TouchableOpacity style={styles.addButton} onPress={handleCreateNewSchedule}>
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={{ position: 'absolute', top: 16, right: 16, zIndex: 1 }}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{editingScheduleId ? "Edit Schedule" : "Add New Schedule"}</Text>

            <View style={{ marginBottom: 16 }}>
              <TouchableOpacity
                style={{ alignItems: 'center' }}
                onPress={() => setShowDatePicker(!showDatePicker)}
              >
                <Text style={{ fontSize: 16, color: '#666' }}>Date: <Text style={{ fontWeight: '600', color: '#2A74F5' }}>{modalDate}</Text></Text>
              </TouchableOpacity>

              {showDatePicker && (
                <Calendar
                  current={modalDate}
                  onDayPress={day => {
                    setModalDate(day.dateString);
                    setShowDatePicker(false);
                  }}
                  theme={{
                    todayTextColor: "#2A74F5",
                    arrowColor: "#2A74F5",
                    selectedDayBackgroundColor: "#2A74F5",
                    selectedDayTextColor: "#fff",
                  }}
                  markedDates={{
                    [modalDate]: { selected: true, selectedColor: "#2A74F5" }
                  }}
                  style={{ marginTop: 10, borderRadius: 8, borderWidth: 1, borderColor: '#eee' }}
                />
              )}
            </View>

            <Text style={styles.inputLabel}>Title</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. Math Review"
              value={title}
              onChangeText={setTitle}
            />

            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              style={[styles.textInput, { height: 80, textAlignVertical: 'top' }]}
              placeholder="Details..."
              value={description}
              onChangeText={setDescription}
              multiline={true}
              numberOfLines={3}
            />

            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Text style={styles.inputLabel}>Start Time</Text>
                <TouchableOpacity
                  style={styles.textInput}
                  onPress={() => setShowTimePicker('start')}
                >
                  <Text>{startTime}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.halfInput}>
                <Text style={styles.inputLabel}>End Time</Text>
                <TouchableOpacity
                  style={styles.textInput}
                  onPress={() => setShowTimePicker('end')}
                >
                  <Text>{endTime}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {showTimePicker && (
              <DateTimePicker
                value={(() => {
                  const timeStr = showTimePicker === 'start' ? startTime : endTime;
                  const [hours, minutes] = timeStr.split(':').map(Number);
                  const d = new Date();
                  d.setHours(hours || 0);
                  d.setMinutes(minutes || 0);
                  return d;
                })()}
                mode="time"
                is24Hour={true}
                locale="en-GB"
                display="spinner"
                onChange={(event, selectedDate) => {
                  const currentMode = showTimePicker;
                  if (Platform.OS === 'android') {
                    setShowTimePicker(null);
                  }
                  if (selectedDate && currentMode) {
                    const hours = selectedDate.getHours().toString().padStart(2, '0');
                    const minutes = selectedDate.getMinutes().toString().padStart(2, '0');
                    const timeString = `${hours}:${minutes}`;
                    if (currentMode === 'start') {
                      setStartTime(timeString);
                    } else {
                      setEndTime(timeString);
                    }
                  }
                }}
              />
            )}

            {Platform.OS === 'ios' && showTimePicker && (
              <TouchableOpacity
                style={{ alignItems: 'center', padding: 10, backgroundColor: '#f0f0f0', borderRadius: 8, marginBottom: 10 }}
                onPress={() => setShowTimePicker(null)}
              >
                <Text style={{ color: '#007AFF', fontWeight: 'bold' }}>Done</Text>
              </TouchableOpacity>
            )}

            <View style={styles.modalButtons}>
              {editingScheduleId && (
                <TouchableOpacity
                  style={[styles.modalBtn, { backgroundColor: '#FF3B30', marginRight: 6 }]}
                  onPress={handleDelete}
                >
                  <Text style={styles.saveBtnText}>Delete</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[styles.modalBtn, styles.saveBtn]}
                onPress={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.saveBtnText}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

function TaskCard({ title, time, type }: { title: string, time: string, type: any }) {
  const iconName = type || "book-outline";
  const iconColor = "#4A90E2";

  return (
    <View style={styles.taskCard}>
      <Ionicons name={iconName} size={24} color={iconColor} />
      <View style={{ marginLeft: 10 }}>
        <Text style={styles.taskTitle}>{title}</Text>
        <Text style={styles.taskTime}>{time}</Text>
      </View>
    </View>
  );
}

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

  emptyText: {
    marginLeft: 16,
    marginTop: 10,
    color: "#999",
    fontStyle: "italic",
  },

  taskCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },


  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
    marginTop: 4,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 12,
    backgroundColor: "#fafafa",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 6,
  },
  cancelBtn: {
    backgroundColor: "#f5f5f5",
  },
  saveBtn: {
    backgroundColor: "#2A74F5",
  },
  cancelBtnText: {
    color: "#333",
    fontWeight: "600",
  },
  saveBtnText: {
    color: "white",
    fontWeight: "600",
  },
});
