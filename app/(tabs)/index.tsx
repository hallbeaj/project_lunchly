import React, { useState } from 'react';
import { StyleSheet, View, Alert, TextInput, Button, Modal, Text } from 'react-native';
import { Calendar } from 'react-native-calendars';

export default function HomeScreen() {
  // State for tasks, selected date, and modal visibility
  const [markedDates, setMarkedDates] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState({});
  const [modalVisible, setModalVisible] = useState(false);

  // Handle clicking on a day
  const handleDayPress = (day) => {
    console.log('Clicked Date:', day.dateString); // Debugging log
    setSelectedDate(day.dateString);

    if (tasks[day.dateString]) {
      // Task already exists, show options
      Alert.alert(
        'Task',
        tasks[day.dateString].task,
        [
          {
            text: tasks[day.dateString].completed ? 'Completed' : 'Mark as Completed',
            onPress: () => markTaskComplete(day.dateString),
          },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
    } else {
      // No task, open modal
      setModalVisible(true);
    }
  };

  // Add a task
  const addTask = () => {
    console.log('Adding Task for:', selectedDate); // Debugging log

    if (!task.trim()) {
      Alert.alert('Error', 'Task cannot be empty!');
      return;
    }

    const newTasks = {
      ...tasks,
      [selectedDate]: { task, completed: false },
    };
    setTasks(newTasks); // Update tasks
    console.log('Tasks:', newTasks); // Debugging log

    const newMarkedDates = {
      ...markedDates,
      [selectedDate]: { marked: true, dotColor: 'red' },
    };
    setMarkedDates(newMarkedDates); // Highlight the date
    console.log('Marked Dates:', newMarkedDates); // Debugging log

    // Reset modal and task input
    setTask('');
    setModalVisible(false);
  };

  // Mark a task as complete
  const markTaskComplete = (date) => {
    const updatedTasks = {
      ...tasks,
      [date]: { ...tasks[date], completed: true },
    };
    setTasks(updatedTasks); // Update task completion status
    console.log('Updated Tasks:', updatedTasks); // Debugging log

    const updatedMarkedDates = { ...markedDates };
    delete updatedMarkedDates[date]; // Remove highlight
    setMarkedDates(updatedMarkedDates);
    console.log('Updated Marked Dates:', updatedMarkedDates); // Debugging log
  };

  return (
    <View style={styles.container}>
      <Calendar
        current={new Date().toISOString().split('T')[0]}
        markedDates={markedDates}
        onDayPress={handleDayPress}
      />

      {/* Task Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Task for {selectedDate}</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter task"
              value={task}
              onChangeText={setTask}
            />
            <View style={styles.modalButtons}>
              <Button title="Add Task" onPress={addTask} />
              <Button title="Cancel" onPress={() => setModalVisible(false)} color="red" />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});