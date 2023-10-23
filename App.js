import React, { useState, useEffect, useRef } from 'react'; 
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import Constants from 'expo-constants';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as Progress from 'react-native-progress';

export default function App() {
  
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [isTicking, setIsTicking] = useState(false);
  const [isCleared, setIsCleared] = useState(false);
  const [secRemaining, setSecRemaining] = useState(0);
  const [alarm, setAlarm] = useState();
  const [inputTime, setInputTime] = useState(new Date())


function TimeRemg(){
  const [hoursRemaining, setHoursRemaining] = useState(0);
  const [minRemaining, setMinRemaining] = useState(0);
  const [now, setNow] = useState(new Date())
  let nowMin = now.getMinutes()
  let nowHour = now.getHours()
  let minInput = inputTime.getMinutes()
  let hourInput = inputTime.getHours()
  let fix =0
 

  if((hourInput == nowHour && minInput == nowMin)&& isTicking){
    alert("Your Alarm is Up")
    clearAlarm()
  }
  
  if (isTicking){
    useInterval(() => {
      if(minInput > nowMin || minInput == nowMin){
        setMinRemaining(minInput - nowMin)
        if(hourInput < nowHour){
          setHoursRemaining(24 -(nowHour-hourInput))
        }else{
          setHoursRemaining(hourInput - nowHour)
        }
        
      }else if (nowMin > minInput) {
        setMinRemaining(60 +minInput - nowMin)
        if(hourInput<= nowHour){
          setHoursRemaining(24 -Math.abs(hourInput - nowHour -1))
        }else{
          setHoursRemaining(Math.abs(hourInput - nowHour -1))
        }

      }
      if(isCleared){
        setMinRemaining(0);
        setHoursRemaining(0)
        setAlarm("")
      }
      setNow(new Date())

    }, 1000)
  } 
    

    return <Text style={styles.text}>  {hoursRemaining} h {minRemaining} m</Text>
  }
  

  function useInterval(callback, delay) {
    const savedCallback = useRef();
  
    useEffect(() => {
      savedCallback.current = callback;
    });
  
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
  
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }, [delay]);
  }
   

  function timeConverter(hour, minutes){
    if (minutes < 10) {
      minutes = "0" + minutes
    }
    if(hour == 0){
      setAlarm(12 + ":" + minutes + "AM") 
    }else if (hour > 11 && hour != 12) {
      setAlarm((hour - 12) + ":" + minutes + "PM") 
    } else if (hour == 12){
      setAlarm(hour + ":" + minutes + "PM")
    }else{
      setAlarm(hour + ":" + minutes + "AM")
    }

  }

  const handleConfirm = (date) => {
    
    let tempHour = date.getHours()
    let tempMin = date.getMinutes()

    setIsCleared(false)
    setInputTime(date)
    timeConverter(tempHour, tempMin);
    setIsTicking(true)
    hideTimePicker()
  };

  const clearAlarm = () => { 
    setIsTicking(false)
    setIsCleared(true)
    hideTimePicker()
    setAlarm("")
  }

  const showTimePicker = () => {
    console.log("hello")
    setTimePickerVisibility(true)
  };

  const hideTimePicker = () => {
    setTimePickerVisibility(false)
  };

  return (
    <View style={styles.container}>
      <View style={styles.alarmContainer}> 
        <Text style={styles.alarmText}> {alarm} </Text>
        <Text style={styles.text}> Time Remaining: </Text>
        <TimeRemg />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
        style={isTicking ? styles.clearButton : styles.createButton}
        onPress={isTicking ? clearAlarm : showTimePicker}
        >
          <Text style={styles.buttonText}> {isTicking ? "Clear" : "Create"} </Text>
        </TouchableOpacity>

        <DateTimePickerModal
          isVisible={isTimePickerVisible}
          mode="time"
          onConfirm={handleConfirm}
          onCancel={hideTimePicker}
          date={new Date()}
        /> 
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1f1f1f',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alarmContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
  },
  buttonContainer: {
    justifyContent: 'center',
    alignContent: 'center',
    flex: 1
  },
  createButton: {
    backgroundColor: "#96B374",
    borderRadius: 100,
    borderColor: "#576944",
    borderWidth: 4,
    width: 100,
    height: 100,
    marginBottom: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  clearButton: {
    backgroundColor: "#C94B33",
    borderRadius: 100,
    borderColor: "#823121",
    borderWidth: 4,
    width: 100,
    height: 100,
    marginBottom: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#f0e7be",
    fontSize: 20,
    fontWeight: "bold"
  },
  alarmText: {
    color: "#F0E7BE",
    fontSize: 65,
    fontWeight: "400",
    marginTop: 100
  },
  text: {
    color: "#f0e7be",
    fontSize: 20,
    fontWeight: "bold"
  }
});
