import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, Alert, FlatList } from 'react-native';

export default function App() {
  const [screen, setScreen] = useState('home');
  const [score, setScore] = useState({ r: 0, w: 0, b: 0 });
  const [innings, setInnings] = useState(1);
  const [target, setTarget] = useState(0);
  const [decision, setDecision] = useState(null);

  const updateScore = (runs) => {
    setScore({ ...score, r: score.r + runs, b: score.b + 1 });
    if (innings === 2 && score.r + runs >= target) Alert.alert("CONGRATS!", "Match Won by Chasing Team!");
  };

  const showDecision = (type, color) => {
    setDecision({ type, color });
    setTimeout(() => setDecision(null), 4000);
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.clubTitle}>MIAN SAAB 10 SPORTS CLUB EM</Text>
        <Text style={styles.builder}>Builders: Mian Saab 10 Sports Club</Text>
      </View>

      {screen === 'home' ? (
        <ScrollView contentContainerStyle={styles.grid}>
          <TouchableOpacity style={styles.card} onPress={() => setScreen('score')}><Text style={styles.icon}>🏏</Text><Text style={styles.cardT}>Scoreboard</Text></TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={() => setScreen('entry')}><Text style={styles.icon}>📝</Text><Text style={styles.cardT}>Team Entry</Text></TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={() => Alert.alert("Draw", "Advanced to Semi-Final")}><Text style={styles.icon}>🎟️</Text><Text style={styles.cardT}>Lucky Draw</Text></TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={() => Alert.alert("Ready", "Tri-Super Over Loaded")}><Text style={styles.icon}>🔥</Text><Text style={styles.cardT}>Tri-Over</Text></TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={() => setScreen('ledger')}><Text style={styles.icon}>💰</Text><Text style={styles.cardT}>Ledger</Text></TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={() => Alert.alert("Safety", "JSON Backup Saved")}><Text style={styles.icon}>☁️</Text><Text style={styles.cardT}>JSON Backup</Text></TouchableOpacity>
        </ScrollView>
      ) : (
        <View style={{flex: 1}}>
          <TouchableOpacity onPress={() => setScreen('home')} style={styles.backBtn}><Text>← Main Menu</Text></TouchableOpacity>
          
          {screen === 'score' && (
            <View style={styles.scoreArea}>
              <View style={styles.mainBoard}>
                <Text style={styles.ovInnings}>{innings === 1 ? "1st Innings" : "Target: " + target}</Text>
                <Text style={styles.ovScore}>{score.r}/{score.w} ({Math.floor(score.b/6)}.{score.b%6})</Text>
              </View>
              {decision && <View style={[styles.decBox, {backgroundColor: decision.color}]}><Text style={styles.decText}>{decision.type}</Text></View>}
              <View style={styles.controls}>
                <TouchableOpacity style={styles.ctrl} onPress={() => updateScore(4)}><Text>4</Text></TouchableOpacity>
                <TouchableOpacity style={styles.ctrl} onPress={() => updateScore(6)}><Text>6</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.ctrl, {backgroundColor:'red'}]} onPress={() => showDecision('OUT', 'red')}><Text style={{color:'white'}}>W</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.ctrl, {backgroundColor:'blue'}]} onPress={() => {setTarget(score.r+1); setInnings(2); setScore({r:0,w:0,b:0})}}><Text style={{color:'white'}}>End</Text></TouchableOpacity>
              </View>
            </View>
          )}

          {screen === 'entry' && (
            <ScrollView style={styles.padding}>
              <Text style={styles.title}>Team Ledger Setup</Text>
              <TextInput placeholder="Team Name" style={styles.input} />
              <TextInput placeholder="Total Fee" style={styles.input} keyboardType="numeric" />
              <TextInput placeholder="Paid Amount" style={styles.input} keyboardType="numeric" />
              <TouchableOpacity style={styles.saveBtn} onPress={() => Alert.alert("Success", "Account Updated")}><Text style={{color:'white', fontWeight:'bold'}}>CONFIRM ENTRY</Text></TouchableOpacity>
            </ScrollView>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f3f5' },
  header: { backgroundColor: '#1B1464', padding: 40, alignItems: 'center', borderBottomWidth: 4, borderBottomColor: '#FFC312' },
  clubTitle: { color: '#FFC312', fontSize: 16, fontWeight: 'bold' },
  builder: { color: 'white', fontSize: 9 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', padding: 15 },
  card: { width: '45%', backgroundColor: 'white', padding: 25, borderRadius: 15, marginVertical: 10, alignItems: 'center', elevation: 5 },
  cardT: { fontWeight: 'bold', fontSize: 11, marginTop: 10 },
  icon: { fontSize: 35 },
  scoreArea: { flex: 1, padding: 20, justifyContent: 'center' },
  mainBoard: { backgroundColor: '#2c3e50', padding: 40, borderRadius: 20, alignItems: 'center' },
  ovInnings: { color: '#FFC312', fontWeight: 'bold' },
  ovScore: { color: 'white', fontSize: 50, fontWeight: 'bold' },
  controls: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 40 },
  ctrl: { backgroundColor: 'white', padding: 20, borderRadius: 15, width: 70, alignItems: 'center', elevation: 3 },
  decBox: { position: 'absolute', top: '30%', width: '100%', padding: 40, alignItems: 'center', alignSelf:'center' },
  decText: { fontSize: 60, color: 'white', fontWeight: 'bold' },
  padding: { padding: 30 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, color: '#1B1464' },
  input: { borderBottomWidth: 1, borderColor: '#ccc', marginBottom: 20, padding: 10 },
  saveBtn: { backgroundColor: '#27ae60', padding: 15, borderRadius: 10, alignItems: 'center' },
  backBtn: { marginTop: 50, marginLeft: 20, fontWeight: 'bold', color: '#1B1464' }
});
