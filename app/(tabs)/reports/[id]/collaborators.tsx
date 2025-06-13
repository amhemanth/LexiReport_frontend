import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

// Mock data for collaborators
const mockCollaborators = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', role: 'Owner' },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', role: 'Editor' },
  { id: '3', name: 'Carol Lee', email: 'carol@example.com', role: 'Viewer' },
];

interface Collaborator {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function CollaboratorsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [collaborators, setCollaborators] = useState(mockCollaborators);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Viewer');
  const [loading, setLoading] = useState(false);
  const [roleModalVisible, setRoleModalVisible] = useState(false);
  const [selectedCollaborator, setSelectedCollaborator] = useState<Collaborator | null>(null);

  const handleAdd = () => {
    if (!email) return Alert.alert('Error', 'Please enter an email');
    setLoading(true);
    setTimeout(() => {
      setCollaborators([...collaborators, { id: Date.now().toString(), name: email.split('@')[0], email, role }]);
      setEmail('');
      setRole('Viewer');
      setLoading(false);
    }, 1000);
  };

  const handleRemove = (id: string) => {
    setCollaborators(collaborators.filter(c => c.id !== id));
  };

  const handleRoleChange = (collaboratorId: string, newRole: string) => {
    setCollaborators(collaborators.map(c => c.id === collaboratorId ? { ...c, role: newRole } : c));
    setRoleModalVisible(false);
    setSelectedCollaborator(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.title}>Collaborators</Text>
        <View style={{ width: 24 }} />
      </View>
      <FlatList
        data={collaborators}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.collaborator}>
            <Ionicons name="person-circle" size={32} color="#2196F3" />
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.email}>{item.email}</Text>
              <TouchableOpacity onPress={() => { setSelectedCollaborator(item); setRoleModalVisible(true); }}>
                <Text style={styles.role}>{item.role} (edit)</Text>
              </TouchableOpacity>
            </View>
            {item.role !== 'Owner' && (
              <TouchableOpacity onPress={() => handleRemove(item.id)}>
                <Ionicons name="remove-circle" size={24} color="#F44336" />
              </TouchableOpacity>
            )}
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No collaborators yet.</Text>}
      />
      <View style={styles.addSection}>
        <TextInput
          style={styles.input}
          placeholder="Invite by email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TouchableOpacity style={styles.roleButton} onPress={() => setRole(role === 'Viewer' ? 'Editor' : role === 'Editor' ? 'Owner' : 'Viewer')}>
          <Text style={styles.roleButtonText}>{role}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addButton} onPress={handleAdd} disabled={loading}>
          <Ionicons name="add-circle" size={32} color="#4CAF50" />
        </TouchableOpacity>
      </View>
      {/* Role selection modal */}
      <Modal
        visible={roleModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setRoleModalVisible(false)}
      >
        <View style={{ flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'rgba(0,0,0,0.3)' }}>
          <View style={{ backgroundColor:'#FFF', borderRadius:12, padding:24, width:280 }}>
            <Text style={{ fontSize:18, fontWeight:'600', marginBottom:16 }}>Change Role</Text>
            {['Owner','Editor','Viewer'].map(r => (
              <TouchableOpacity key={r} style={{ padding:12 }} onPress={() => handleRoleChange(selectedCollaborator?.id, r)}>
                <Text style={{ fontSize:16, color: selectedCollaborator?.role === r ? '#2196F3' : '#222' }}>{r}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={{ marginTop:16, alignSelf:'flex-end' }} onPress={() => setRoleModalVisible(false)}>
              <Text style={{ color:'#F44336', fontWeight:'500' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  backButton: { padding: 8 },
  title: { flex: 1, fontSize: 20, fontWeight: '600', color: '#1A1A1A', textAlign: 'center' },
  collaborator: { flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  info: { flex: 1, marginLeft: 12 },
  name: { fontSize: 16, fontWeight: '500', color: '#222' },
  email: { fontSize: 14, color: '#666' },
  role: { fontSize: 12, color: '#2196F3', marginTop: 2 },
  empty: { textAlign: 'center', color: '#AAA', marginTop: 32 },
  addSection: { flexDirection: 'row', alignItems: 'center', padding: 16, borderTopWidth: 1, borderTopColor: '#EEE' },
  input: { flex: 1, borderWidth: 1, borderColor: '#DDD', borderRadius: 8, padding: 8, marginRight: 8 },
  roleButton: { backgroundColor: '#E3F2FD', borderRadius: 8, padding: 8, marginRight: 8 },
  roleButtonText: { color: '#2196F3', fontWeight: '500' },
  addButton: { padding: 4 },
}); 