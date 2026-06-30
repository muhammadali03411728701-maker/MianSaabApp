import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, Alert, Image, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Camera } from 'expo-camera';

export default function App() {
  const [screen, setScreen] = useState('home');
  const [clubName] = useState("MIAN SAAB 10 SPORTS CLUB EM");
  const [eventNo] = useState("73");
  const [score, setScore] = useState({ r: 0, w: 0, b: 0 });
  const [decision, setDecision] = useState(null);
  const [teams, setTeams] = useState([]);

  // --- Functions ---
  const applyDecision = (type, color) => {
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
          <TouchableOpacity style={styles.card} onPress={() => setScreen('live')}><Text style={styles.icon}>📹</Text><Text style={styles.cardT}>Live Score</Text></TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={() => setScreen('entry')}><Text style={styles.icon}>📝</Text><Text style={styles.cardT}>Team Entry</Text></TouchableOpacity>
          <TouchableOpacity style={styles.card}><Text style={styles.icon}>🎟️</Text><Text style={styles.cardT}>Lucky Draws</Text></TouchableOpacity>
          <TouchableOpacity style={styles.card}><Text style={styles.icon}>💰</Text><Text style={styles.cardT}>Accounts</Text></TouchableOpacity>
        </ScrollView>
      ) : (
        <View style={{flex: 1}}>
          <TouchableOpacity onPress={() => setScreen('home')} style={styles.backBtn}><Text>← Exit</Text></TouchableOpacity>
          {screen === 'live' && (
            <View style={styles.full}>
              <Camera style={styles.camera} type={Camera.Constants.Type.back} />
              <View style={styles.scoreOverlay}>
                <Text style={styles.ovText}>Event #{eventNo} | {clubName}</Text>
                <Text style={styles.ovScore}>{score.r}/{score.w} ({Math.floor(score.b/6)}.{score.b%6})</Text>
              </View>
              {decision && <View style={[styles.decBox, {backgroundColor: decision.color}]}><Text style={styles.decText}>{decision.type}</Text></View>}
              <View style={styles.liveControls}>
                <TouchableOpacity style={styles.ctrl} onPress={() => setScore({...score, r: score.r+4})}><Text>4</Text></TouchableOpacity>
                <TouchableOpacity style={styles.ctrl} onPress={() => setScore({...score, r: score.r+6})}><Text>6</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.ctrl, {backgroundColor:'red'}]} onPress={() => applyDecision('OUT', 'red')}><Text style={{color:'white'}}>W</Text></TouchableOpacity>
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
  full: { flex: 1 },
  camera: { flex: 1 },
  scoreOverlay: { position: 'absolute', top: 50, left: 20, backgroundColor: 'rgba(0,0,0,0.6)', padding: 15, borderRadius: 10 },
  ovText: { color: '#FFC312', fontSize: 10 },
  ovScore: { color: 'white', fontSize: 30, fontWeight: 'bold' },
  liveControls: { position: 'absolute', bottom: 30, width: '100%', flexDirection: 'row', justifyContent: 'space-around' },
  ctrl: { backgroundColor: 'white', padding: 15, borderRadius: 10, width: 60, alignItems: 'center' },
  decBox: { position: 'absolute', top: '35%', width: '100%', padding: 40, alignItems: 'center' },
  decText: { fontSize: 50, color: 'white', fontWeight: 'bold' },
  backBtn: { marginTop: 50, marginLeft: 20, fontWeight: 'bold' }
});
