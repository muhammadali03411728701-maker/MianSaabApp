import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, Text, View, TouchableOpacity, ScrollView, 
  TextInput, Alert, FlatList, Dimensions, Image 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NodeCameraView } from 'react-native-nodemediaclient';
import { Video } from 'expo-av'; // Stable Video Engine for Review
import * as ImagePicker from 'expo-image-picker';

const { width, height } = Dimensions.get('window');

export default function App() {
  // --- 1. CORE STATES ---
  const [screen, setScreen] = useState('home');
  const [clubName] = useState("Mian Saab 10 Sports Club EM");
  const [eventNo] = useState("73");
  const [teams, setTeams] = useState([]);
  const [score, setScore] = useState({ r: 0, w: 0, b: 0 });
  const [decision, setDecision] = useState(null);
  const [isReviewing, setIsReviewing] = useState(false);
  const [streamUrl, setStreamUrl] = useState("");

  // --- 2. TEAM ENTRY STATE ---
  const [tName, setTName] = useState('');
  const [tOwner, setTOwner] = useState('');
  const [tAddr, setTAddr] = useState('');
  const [tFee, setTFee] = useState('');
  const [tPaid, setTPaid] = useState('');
  const [tImg, setTImg] = useState(null);

  // --- 3. FUNCTIONS ---
  const pickImage = async () => {
    let res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, aspect: [1, 1], quality: 0.5,
    });
    if (!res.canceled) setTImg(res.assets[0].uri);
  };

  const saveTeam = async () => {
    const pend = (parseFloat(tFee) || 0) - (parseFloat(tPaid) || 0);
    const newTeam = { id: Date.now().toString(), name: tName, owner: tOwner, pending: pend, img: tImg };
    const updatedTeams = [...teams, newTeam];
    setTeams(updatedTeams);
    await AsyncStorage.setItem('mian_saab_db', JSON.stringify(updatedTeams));
    Alert.alert("Success", `Team Saved! Status: ${pend <= 0 ? 'Nil' : pend}`);
    setTName(''); setTOwner(''); setTImg(null);
  };

  const applyDecision = (type, color) => {
    setDecision({ type, color });
    setIsReviewing(false);
    setTimeout(() => setDecision(null), 4000);
  };

  // --- 4. UI SCREENS ---
  const Header = () => (
    <View style={styles.header}>
      <Text style={styles.clubTitle}>{clubName}</Text>
      <Text style={styles.builder}>Builders: Mian Saab 10 Sports Club</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header />
      
      {screen === 'home' ? (
        <ScrollView contentContainerStyle={styles.grid}>
          <MenuCard t="Live Broadcast" i="📹" onPress={() => setScreen('live')} />
          <MenuCard t="Team Entry" i="📝" onPress={() => setScreen('entry')} />
          <MenuCard t="Lucky Draws" i="🎟️" onPress={() => Alert.alert("Lucky Draw", "Qualified via Parchi!")} />
          <MenuCard t="Tri-Super Over" i="🔥" onPress={() => Alert.alert("Tri-Super Over", "Ready for 3 Teams!")} />
          <MenuCard t="Ledger" i="💰" onPress={() => setScreen('ledger')} />
          <MenuCard t="JSON Backup" i="☁️" onPress={() => Alert.alert("Backup", "Copy to Google Drive")} />
        </ScrollView>
      ) : (
        <View style={{flex: 1}}>
          <TouchableOpacity onPress={() => setScreen('home')} style={styles.backBtn}><Text>← Exit</Text></TouchableOpacity>
          
          {/* LIVE STREAM & REVIEW SCREEN */}
          {screen === 'live' && (
            <View style={styles.full}>
              <NodeCameraView 
                style={styles.camera} 
                outputUrl={streamUrl || "rtmp://a.rtmp.youtube.com/live2/KEY"} 
                camera={{cameraId: 1}} 
                autopreview={true} 
              />
              
              {/* Overlay Scoreboard */}
              <View style={styles.scoreOverlay}>
                <Text style={styles.ovText}>Event #{eventNo} | {clubName}</Text>
                <Text style={styles.ovScore}>{score.r}/{score.w} ({Math.floor(score.b/6)}.{score.b%6})</Text>
              </View>

              {decision && (
                <View style={[styles.decBox, {backgroundColor: decision.color}]}>
                  <Text style={styles.decText}>{decision.type}</Text>
                </View>
              )}

              {/* Controls */}
              <View style={styles.liveControls}>
                 <TouchableOpacity style={styles.ctrl} onPress={() => setIsReviewing(true)}><Text>Review</Text></TouchableOpacity>
                 <TouchableOpacity style={styles.ctrl} onPress={() => setScore({...score, r: score.r+4, b: score.b+1})}><Text>4</Text></TouchableOpacity>
                 <TouchableOpacity style={styles.ctrl} onPress={() => setScore({...score, r: score.r+6, b: score.b+1})}><Text>6</Text></TouchableOpacity>
                 <TouchableOpacity style={[styles.ctrl, {backgroundColor: 'red'}]} onPress={() => applyDecision('OUT', 'red')}><Text style={{color:'white'}}>W</Text></TouchableOpacity>
              </View>

              {isReviewing && (
                <View style={styles.reviewPop}>
                   <Text style={{fontWeight:'bold', color:'red'}}>SLOW-MO REVIEW MODE</Text>
                   <View style={styles.row}>
                      <TouchableOpacity onPress={() => applyDecision('NOT OUT', 'green')} style={styles.decBtn}><Text>NOT OUT</Text></TouchableOpacity>
                      <TouchableOpacity onPress={() => applyDecision('DEAD BALL', 'grey')} style={styles.decBtn}><Text>DEAD</Text></TouchableOpacity>
                      <TouchableOpacity onPress={() => setIsReviewing(false)} style={styles.decBtn}><Text>Close</Text></TouchableOpacity>
                   </View>
                </View>
              )}
            </View>
          )}

          {/* TEAM ENTRY SCREEN */}
          {screen === 'entry' && (
            <ScrollView style={styles.padding}>
              <Text style={styles.title}>Team Registration</Text>
              <TouchableOpacity onPress={pickImage} style={styles.imageBox}>
                {tImg ? <Image source={{uri: tImg}} style={styles.fullImg} /> : <Text>+ Add Photo</Text>}
              </TouchableOpacity>
              <TextInput placeholder="Team Name" style={styles.input} onChangeText={setTName} />
              <TextInput placeholder="Owner Name" style={styles.input} onChangeText={setTOwner} />
              <TextInput placeholder="Total Fee" style={styles.input} keyboardType="numeric" onChangeText={setTFee} />
              <TextInput placeholder="Paid Amount" style={styles.input} keyboardType="numeric" onChangeText={setTPaid} />
              <TouchableOpacity style={styles.saveBtn} onPress={saveTeam}><Text style={{color:'white', fontWeight:'bold'}}>CONFIRM ENTRY</Text></TouchableOpacity>
            </ScrollView>
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
  header: { backgroundColor: '#1B1464', padding: 40, alignItems: 'center', borderBottomWidth: 4, borderBottomColor: '#FFC312' },
  clubTitle: { color: '#FFC312', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  builder: { color: 'white', fontSize: 9 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', padding: 15 },
  card: { width: '45%', backgroundColor: 'white', padding: 20, borderRadius: 15, marginBottom: 15, alignItems: 'center', elevation: 5 },
  cardT: { fontWeight: 'bold', fontSize: 11, marginTop: 10, textAlign: 'center' },
  full: { flex: 1 },
  camera: { flex: 1, backgroundColor: 'black' },
  scoreOverlay: { position: 'absolute', top: 50, left: 20, backgroundColor: 'rgba(0,0,0,0.6)', padding: 15, borderRadius: 10 },
  ovText: { color: '#FFC312', fontSize: 10 },
  ovScore: { color: 'white', fontSize: 32, fontWeight: 'bold' },
  liveControls: { position: 'absolute', bottom: 20, width: '100%', flexDirection: 'row', justifyContent: 'space-around' },
  ctrl: { backgroundColor: 'white', padding: 15, borderRadius: 10, width: 70, alignItems: 'center' },
  decBox: { position: 'absolute', top: '35%', width: '100%', padding: 40, alignItems: 'center' },
  decText: { fontSize: 60, fontWeight: 'bold', color: 'white' },
  reviewPop: { position: 'absolute', bottom: 100, width: '100%', backgroundColor: 'white', padding: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 15 },
  decBtn: { backgroundColor: '#ddd', padding: 10, borderRadius: 5 },
  padding: { padding: 30 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, color: '#1B1464' },
  input: { borderBottomWidth: 1, borderColor: '#ccc', marginBottom: 20, padding: 10 },
  imageBox: { width: 100, height: 100, backgroundColor: '#eee', borderRadius: 50, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginBottom: 20, overflow: 'hidden' },
  fullImg: { width: '100%', height: '100%' },
  saveBtn: { backgroundColor: '#27ae60', padding: 15, borderRadius: 10, alignItems: 'center' },
  backBtn: { marginTop: 50, marginLeft: 20, fontWeight: 'bold' }
});
