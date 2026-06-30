import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, Alert, Image } from 'react-native';
import { Camera } from 'expo-camera';

export default function App() {
  const [screen, setScreen] = useState('home');
  const [score, setScore] = useState({ r: 0, w: 0, b: 0 });
  const [innings, setInnings] = useState(1);
  const [target, setTarget] = useState(0);
  const [decision, setDecision] = useState(null);

  // --- Functions ---
  const applyDecision = (type, color) => {
    setDecision({ type, color });
    setTimeout(() => setDecision(null), 4000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.clubTitle}>MIAN SAAB 10 SPORTS CLUB EM</Text>
        <Text style={styles.builder}>Builders: Mian Saab 10 Sports Club</Text>
      </View>

      {screen === 'home' ? (
        <ScrollView contentContainerStyle={styles.grid}>
          <TouchableOpacity style={styles.card} onPress={() => setScreen('live')}><Text style={styles.icon}>📹</Text><Text style={styles.cardT}>Live Center</Text></TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={() => setScreen('entry')}><Text style={styles.icon}>📝</Text><Text style={styles.cardT}>Team Entry</Text></TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={() => Alert.alert("Lucky Draw", "Team Advanced via Parchi!")}><Text style={styles.icon}>🎟️</Text><Text style={styles.cardT}>Lucky Draws</Text></TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={() => Alert.alert("Tri-Super Over", "Ready for 3 Teams!")}><Text style={styles.icon}>🔥</Text><Text style={styles.cardT}>Tri-Over</Text></TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={() => setScreen('ledger')}><Text style={styles.icon}>💰</Text><Text style={styles.cardT}>Accounts</Text></TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={() => Alert.alert("Backup", "JSON Data Exported!")}><Text style={styles.icon}>☁️</Text><Text style={styles.cardT}>Safety Backup</Text></TouchableOpacity>
        </ScrollView>
      ) : (
        <View style={{flex: 1}}>
          <TouchableOpacity onPress={() => setScreen('home')} style={styles.backBtn}><Text>← Exit</Text></TouchableOpacity>
          
          {screen === 'live' && (
            <View style={styles.full}>
              <Camera style={styles.camera} type={Camera.Constants.Type.back} />
              <View style={styles.scoreOverlay}>
                <Text style={styles.ovInnings}>{innings === 1 ? "1st Innings" : "Target: " + target}</Text>
                <Text style={styles.ovScore}>{score.r}/{score.w} ({Math.floor(score.b/6)}.{score.b%6})</Text>
              </View>
              {decision && <View style={[styles.decBox, {backgroundColor: decision.color}]}><Text style={styles.decText}>{decision.type}</Text></View>}
              <View style={styles.liveControls}>
                <TouchableOpacity style={styles.ctrl} onPress={() => setScore({...score, r: score.r+4, b: score.b+1})}><Text>4</Text></TouchableOpacity>
                <TouchableOpacity style={styles.ctrl} onPress={() => setScore({...score, r: score.r+6, b: score.b+1})}><Text>6</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.ctrl, {backgroundColor:'red'}]} onPress={() => applyDecision('OUT', 'red')}><Text style={{color:'white'}}>W</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.ctrl, {backgroundColor:'blue'}]} onPress={() => {setTarget(score.r + 1); setInnings(2); setScore({r:0,w:0,b:0})}}><Text style={{color:'white'}}>End</Text></TouchableOpacity>
              </View>
            </View>
          )}

          {screen === 'entry' && (
            <ScrollView style={styles.padding}>
              <Text style={styles.title}>New Team Registration</Text>
              <TextInput placeholder="Team Name" style={styles.input} />
              <TextInput placeholder="Total Fee" style={styles.input} keyboardType="numeric" />
              <TextInput placeholder="Paid Amount" style={styles.input} keyboardType="numeric" />
              <TouchableOpacity style={styles.saveBtn} onPress={() => Alert.alert("Success", "Team Data Saved!")}><Text style={{color:'white', fontWeight:'bold'}}>REGISTER TEAM</Text></TouchableOpacity>
            </ScrollView>
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
  full: { flex: 1, backgroundColor: 'black' },
  camera: { flex: 1 },
  scoreOverlay: { position: 'absolute', top: 60, left: 20, backgroundColor: 'rgba(0,0,0,0.6)', padding: 15, borderRadius: 10 },
  ovInnings: { color: '#FFC312', fontSize: 10, fontWeight: 'bold' },
  ovScore: { color: 'white', fontSize: 32, fontWeight: 'bold' },
  liveControls: { position: 'absolute', bottom: 30, width: '100%', flexDirection: 'row', justifyContent: 'space-around' },
  ctrl: { backgroundColor: 'white', padding: 15, borderRadius: 10, width: 65, alignItems: 'center' },
  decBox: { position: 'absolute', top: '35%', width: '100%', padding: 40, alignItems: 'center' },
  decText: { fontSize: 50, color: 'white', fontWeight: 'bold' },
  padding: { padding: 30 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, color: '#1B1464' },
  input: { borderBottomWidth: 1, borderColor: '#ccc', marginBottom: 20, padding: 10 },
  saveBtn: { backgroundColor: '#27ae60', padding: 15, borderRadius: 10, alignItems: 'center' },
  backBtn: { marginTop: 50, marginLeft: 20, fontWeight: 'bold' }
});
