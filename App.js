import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, Alert, FlatList, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

export default function App() {
  const [screen, setScreen] = useState('home');
  const [clubName] = useState("MIAN SAAB 10 SPORTS CLUB EM");
  const [eventNo] = useState("73");
  const [score, setScore] = useState({ r: 0, w: 0, b: 0 });
  const [innings, setInnings] = useState(1);
  const [target, setTarget] = useState(0);
  const [decision, setDecision] = useState(null);
  const [teams, setTeams] = useState([]);

  // --- Functions ---
  const updateScore = (runs) => {
    setScore({ ...score, r: score.r + runs, b: score.b + 1 });
    if (innings === 2 && (score.r + runs) >= target) Alert.alert("MATCH OVER", "Winner Declared!");
  };

  const showDecision = (type, color) => {
    setDecision({ type, color });
    setTimeout(() => setDecision(null), 4000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.clubTitle}>{clubName}</Text>
        <Text style={styles.builder}>Builders: Mian Saab 10 Sports Club</Text>
      </View>

      {screen === 'home' ? (
        <ScrollView contentContainerStyle={styles.grid}>
          <TouchableOpacity style={styles.card} onPress={() => setScreen('score')}><Text style={styles.icon}>🏏</Text><Text style={styles.cardT}>Scoreboard</Text></TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={() => setScreen('entry')}><Text style={styles.icon}>📝</Text><Text style={styles.cardT}>Team Entry</Text></TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={() => Alert.alert("Lucky Draw", "Team Advanced via Parchi!")}><Text style={styles.icon}>🎟️</Text><Text style={styles.cardT}>Lucky Draws</Text></TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={() => Alert.alert("Tri-Over", "18-Balls Mode Ready!")}><Text style={styles.icon}>🔥</Text><Text style={styles.cardT}>Tri-Super Over</Text></TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={() => setScreen('ledger')}><Text style={styles.icon}>💰</Text><Text style={styles.cardT}>Accounts</Text></TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={() => Alert.alert("Backup", "JSON Data Exported!")}><Text style={styles.icon}>☁️</Text><Text style={styles.cardT}>Safety Backup</Text></TouchableOpacity>
        </ScrollView>
      ) : (
        <View style={{flex: 1}}>
          <TouchableOpacity onPress={() => setScreen('home')} style={styles.backBtn}><Text>← Exit</Text></TouchableOpacity>
          {screen === 'score' && (
            <View style={styles.scoreArea}>
              <View style={styles.board}>
                <Text style={styles.ovInnings}>{innings === 1 ? "1st Innings" : "Target: " + target}</Text>
                <Text style={styles.ovScore}>{score.r}/{score.w}</Text>
                <Text style={styles.ovText}>Overs: {Math.floor(score.b/6)}.{score.b%6}</Text>
              </View>
              {decision && <View style={[styles.decBox, {backgroundColor: decision.color}]}><Text style={styles.decText}>{decision.type}</Text></View>}
              <View style={styles.controls}>
                <TouchableOpacity style={styles.ctrl} onPress={() => updateScore(4)}><Text>4</Text></TouchableOpacity>
                <TouchableOpacity style={styles.ctrl} onPress={() => updateScore(6)}><Text>6</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.ctrl, {backgroundColor:'red'}]} onPress={() => showDecision('OUT', 'red')}><Text style={{color:'white'}}>W</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.ctrl, {backgroundColor:'blue'}]} onPress={() => {setTarget(score.r+1); setInnings(2); setScore({r:0,w:0,b:0})}}><Text style={{color:'white'}}>Next</Text></TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f3f5' },
  header: { backgroundColor: '#1B1464', padding: 40, alignItems: 'center' },
  clubTitle: { color: '#FFC312', fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
  builder: { color: 'white', fontSize: 9 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', padding: 15 },
  card: { width: '45%', backgroundColor: 'white', padding: 25, borderRadius: 15, marginVertical: 10, alignItems: 'center', elevation: 5 },
  cardT: { fontWeight: 'bold', fontSize: 10, marginTop: 10 },
  icon: { fontSize: 35 },
  scoreArea: { flex: 1, padding: 20, justifyContent: 'center' },
  board: { backgroundColor: '#2c3e50', padding: 40, borderRadius: 20, alignItems: 'center' },
  ovInnings: { color: '#FFC312', fontWeight: 'bold' },
  ovScore: { color: 'white', fontSize: 60, fontWeight: 'bold' },
  ovText: { color: 'white', fontSize: 20 },
  controls: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 40 },
  ctrl: { backgroundColor: 'white', padding: 20, borderRadius: 15, width: 70, alignItems: 'center', elevation: 3 },
  decBox: { position: 'absolute', top: '30%', width: '100%', padding: 40, alignItems: 'center', alignSelf:'center' },
  decText: { fontSize: 50, color: 'white', fontWeight: 'bold' },
  backBtn: { marginTop: 50, marginLeft: 20, fontWeight: 'bold', color: '#1B1464' }
});
