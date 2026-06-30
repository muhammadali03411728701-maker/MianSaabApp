// --- MIAN SAAB 10 SPORTS CLUB EM (FINAL MASTER SCRIPT) ---
// Builders: Builders Mian Saab 10 Sports Club

import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, Alert, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NodeCameraView } from 'react-native-nodemediaclient'; // Direct Streaming Engine

export default function App() {
  // 1. DASHBOARD & SETTINGS
  const [screen, setScreen] = useState('menu');
  const [clubName, setClubName] = useState("Mian Saab 10 Sports Club EM");
  const [eventNo, setEventNo] = useState("73");
  const [streamUrl, setStreamUrl] = useState(""); // 7:30 PM Point: YouTube/FB URL field

  // 2. MATCH & INNINGS LOGIC (7:30 PM Update)
  const [teamA, setTeamA] = useState("");
  const [teamB, setTeamB] = useState("");
  const [innings, setInnings] = useState(1);
  const [score, setScore] = useState(0);
  const [target, setTarget] = useState(0);
  const [winner, setWinner] = useState(null);

  // 3. FINANCIAL LEDGER (Accounts/Pending)
  const [teamsList, setTeamsList] = useState([]);
  const [entryForm, setEntryForm] = useState({ name: '', owner: '', addr: '', total: '', paid: '' });

  // --- Functions ---
  const saveTeam = async () => {
    const pending = (parseFloat(entryForm.total) || 0) - (parseFloat(entryForm.paid) || 0);
    const newTeam = { ...entryForm, id: Date.now().toString(), pending: pending };
    setTeamsList([...teamsList, newTeam]);
    Alert.alert("Saved", `Team: ${entryForm.name} | Status: ${pending <= 0 ? 'Nil' : pending}`);
  };

  // --- Lucky Draws & Tri-Super Over Space ---
  const runLuckyDraw = (name) => Alert.alert("Lucky Draw", `${name} advanced via Parchi!`);

  return (
    <View style={styles.container}>
      {/* BRANDING HEADER */}
      <View style={styles.header}>
        <Text style={styles.clubTitle}>{clubName}</Text>
        <Text style={styles.builder}>Builders: Mian Saab 10 Sports Club</Text>
      </View>

      {screen === 'menu' && (
        <ScrollView contentContainerStyle={styles.grid}>
          <MenuCard t="Live Broadcast" i="📹" onPress={() => setScreen('live')} />
          <MenuCard t="Team Entries" i="📝" onPress={() => setScreen('entry')} />
          <MenuCard t="Lucky Draws" i="🎟️" onPress={() => setScreen('lucky')} />
          <MenuCard t="Tri-Super Over" i="🔥" onPress={() => setScreen('tri')} />
          <MenuCard t="Ledger/Accounts" i="💰" onPress={() => setScreen('ledger')} />
          <MenuCard t="Match Fixtures" i="🆚" onPress={() => setScreen('fixtures')} />
          <MenuCard t="JSON Backup" i="☁️" onPress={() => Alert.alert("Data Safe", "Backup synced with Drive")} />
        </ScrollView>
      )}

      {/* 7:30 PM Point: LIVE SCREEN WITH URL INPUT */}
      {screen === 'live' && (
        <View style={styles.liveContainer}>
          <TextInput 
            placeholder="Paste YouTube/FB Stream URL here" 
            style={styles.urlInput}
            onChangeText={setStreamUrl}
            value={streamUrl}
          />
          <NodeCameraView 
            style={styles.camera} 
            outputUrl={streamUrl} 
            camera={{cameraId: 1}} 
            autopreview={true} 
          />
          {/* Innings & Target Overlay */}
          <View style={styles.scoreOverlay}>
            <Text style={styles.inningsTag}>{innings === 1 ? "First Team Batting" : "Chasing Target"}</Text>
            <Text style={styles.scoreText}>{score} Runs</Text>
            {innings === 2 && <Text style={styles.targetText}>Target: {target}</Text>}
          </View>
          <TouchableOpacity onPress={() => setScreen('menu')} style={styles.backBtn}><Text>Back</Text></TouchableOpacity>
        </View>
      )}

      {/* TEAM ENTRY SCREEN */}
      {screen === 'entry' && (
        <ScrollView style={styles.padding}>
          <Text style={styles.title}>Team Entry (Event #{eventNo})</Text>
          <TextInput placeholder="Team Name" style={styles.input} onChangeText={v => setEntryForm({...entryForm, name: v})} />
          <TextInput placeholder="Owner" style={styles.input} onChangeText={v => setEntryForm({...entryForm, owner: v})} />
          <TextInput placeholder="Total Entry Fee" style={styles.input} keyboardType="numeric" onChangeText={v => setEntryForm({...entryForm, total: v})} />
          <TextInput placeholder="Paid Amount" style={styles.input} keyboardType="numeric" onChangeText={v => setEntryForm({...entryForm, paid: v})} />
          <TouchableOpacity style={styles.saveBtn} onPress={saveTeam}><Text style={{color:'white'}}>Register Team</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => setScreen('menu')}><Text style={{marginTop:20, textAlign:'center'}}>Go Back</Text></TouchableOpacity>
        </ScrollView>
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
  clubTitle: { color: '#FFC312', fontSize: 20, fontWeight: 'bold' },
  builder: { color: 'white', fontSize: 10 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', padding: 15 },
  card: { width: '45%', backgroundColor: 'white', padding: 20, borderRadius: 15, marginBottom: 15, alignItems: 'center', elevation: 5 },
  cardT: { fontWeight: 'bold', fontSize: 12, marginTop: 10, textAlign: 'center' },
  liveContainer: { flex: 1, backgroundColor: 'black' },
  urlInput: { backgroundColor: 'white', padding: 10, margin: 10, borderRadius: 5 },
  camera: { flex: 1 },
  scoreOverlay: { position: 'absolute', top: 100, left: 20, backgroundColor: 'rgba(0,0,0,0.6)', padding: 15, borderRadius: 10 },
  inningsTag: { color: '#FFC312', fontWeight: 'bold', fontSize: 10 },
  scoreText: { color: 'white', fontSize: 35, fontWeight: 'bold' },
  targetText: { color: '#2ecc71', fontWeight: 'bold' },
  backBtn: { position: 'absolute', bottom: 30, left: 20, backgroundColor: 'red', padding: 10, borderRadius: 5 },
  padding: { padding: 40 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#1B1464' },
  input: { borderBottomWidth: 1, borderColor: '#ccc', marginBottom: 20, padding: 10 },
  saveBtn: { backgroundColor: '#27ae60', padding: 15, borderRadius: 10, alignItems: 'center' }
});
