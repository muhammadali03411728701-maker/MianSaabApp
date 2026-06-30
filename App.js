import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, Alert, Image, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Camera } from 'expo-camera';
import { Video } from 'expo-av';

export default function App() {
  const [screen, setScreen] = useState('home');
  const [clubName] = useState("MIAN SAAB 10 SPORTS CLUB EM");
  const [eventNo] = useState("73");
  const [teams, setTeams] = useState([]);
  const [score, setScore] = useState({ r: 0, w: 0, b: 0 });
  const [decision, setDecision] = useState(null);

  // --- Functions ---
  const applyDecision = (type, color) => {
    setDecision({ type, color });
    setTimeout(() => setDecision(null), 4000);
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.clubTitle}>{clubName}</Text>
        <Text style={styles.builder}>Builders: Mian Saab 10 Sports Club</Text>
      </View>

      {screen === 'home' ? (
        <ScrollView contentContainerStyle={styles.grid}>
          <MenuCard t="Live Score" i="📹" onPress={() => setScreen('live')} />
          <MenuCard t="Team Entry" i="📝" onPress={() => setScreen('entry')} />
          <MenuCard t="Lucky Draws" i="🎟️" onPress={() => Alert.alert("Lucky Draw", "Qualified!")} />
          <MenuCard t="Tri-Super Over" i="🔥" onPress={() => Alert.alert("Tri-Over", "Ready!")} />
          <MenuCard t="Ledger" i="💰" onPress={() => setScreen('ledger')} />
          <MenuCard t="Backup JSON" i="☁️" onPress={() => Alert.alert("Backup", "Data Safe!")} />
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

          {screen === 'entry' && (
            <View style={styles.padding}>
              <Text style={styles.title}>Team Registration</Text>
              <TextInput placeholder="Team Name" style={styles.input} />
              <TextInput placeholder="Total Fee" style={styles.input} keyboardType="numeric" />
              <TextInput placeholder="Paid Amount" style={styles.input} keyboardType="numeric" />
              <TouchableOpacity style={styles.saveBtn} onPress={() => Alert.alert("Success", "Saved!")}><Text style={{color:'white'}}>Save Entry</Text></TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const MenuCard = ({t, i, onPress}) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <Text style={{fontSize: 40}}>{i}</Text>
    <Text style={styles.cardT}>{t}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f3f5' },
  header: { backgroundColor: '#1B1464', padding: 40, alignItems: 'center' },
  clubTitle: { color: '#FFC312', fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
  builder: { color: 'white', fontSize: 9 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', padding: 15 },
  card: { width: '45%', backgroundColor: 'white', padding: 20, borderRadius: 15, marginBottom: 15, alignItems: 'center', elevation: 5 },
  cardT: { fontWeight: 'bold', fontSize: 10, marginTop: 10, textAlign: 'center' },
  full: { flex: 1, backgroundColor: 'black' },
  camera: { flex: 1 },
  scoreOverlay: { position: 'absolute', top: 50, left: 20, backgroundColor: 'rgba(0,0,0,0.6)', padding: 15, borderRadius: 10 },
  ovText: { color: '#FFC312', fontSize: 10 },
  ovScore: { color: 'white', fontSize: 30, fontWeight: 'bold' },
  liveControls: { position: 'absolute', bottom: 30, width: '100%', flexDirection: 'row', justifyContent: 'space-around' },
  ctrl: { backgroundColor: 'white', padding: 15, borderRadius: 10, width: 60, alignItems: 'center' },
  decBox: { position: 'absolute', top: '35%', width: '100%', padding: 40, alignItems: 'center' },
  decText: { fontSize: 50, color: 'white', fontWeight: 'bold' },
  padding: { padding: 30 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, color: '#1B1464' },
  input: { borderBottomWidth: 1, borderColor: '#ccc', marginBottom: 20, padding: 10 },
  saveBtn: { backgroundColor: '#27ae60', padding: 15, borderRadius: 10, alignItems: 'center' },
  backBtn: { marginTop: 50, marginLeft: 20, fontWeight: 'bold' }
});
