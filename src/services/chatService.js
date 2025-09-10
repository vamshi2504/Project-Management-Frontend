import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  where,
  getDocs,
  setDoc
} from 'firebase/firestore';
import axios from 'axios';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { db, storage } from '../firebase';

class ChatService {
  constructor() {
    this.websocket = null;
    this.listeners = new Map();
  }

  // WebSocket connection
  connectWebSocket(userId, onMessage) {
    // For now, we'll use Firebase real-time listeners
    // In production, you might want to use Socket.io or native WebSocket
    this.setupRealtimeListeners(userId, onMessage);
  }

  disconnectWebSocket() {
    if (this.websocket) {
      this.websocket.close();
    }
    // Cleanup Firebase listeners
    this.listeners.forEach(unsubscribe => unsubscribe());
    this.listeners.clear();
  }

  // Group management
  async createGroup(groupData) {
    try {
      const groupRef = await addDoc(collection(db, 'groups'), {
        ...groupData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        memberCount: groupData.members ? groupData.members.length : 0
      });
      return groupRef.id;
    } catch (error) {
      console.error('Error creating group:', error);
      throw error;
    }
  }

  async joinGroup(groupId, userId) {
    try {
      const groupRef = doc(db, 'groups', groupId);
      await updateDoc(groupRef, {
        members: arrayUnion(userId),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error joining group:', error);
      throw error;
    }
  }

  async leaveGroup(groupId, userId) {
    try {
      const groupRef = doc(db, 'groups', groupId);
      await updateDoc(groupRef, {
        members: arrayRemove(userId),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error leaving group:', error);
      throw error;
    }
  }

  async getUserGroups(userId) {
    try {
      // Temporarily remove orderBy to avoid index requirement
      // TODO: Create Firebase composite index and restore orderBy
      const q = query(
        collection(db, 'groups'),
        where('members', 'array-contains', userId)
        // orderBy('updatedAt', 'desc') // Commented out until index is created
      );
      const snapshot = await getDocs(q);
      const groups = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Sort in JavaScript as temporary workaround
      return groups.sort((a, b) => {
        const aTime = a.updatedAt?.toDate?.() || new Date(0);
        const bTime = b.updatedAt?.toDate?.() || new Date(0);
        return bTime - aTime;
      });
    } catch (error) {
      console.error('Error fetching user groups:', error);
      throw error;
    }
  }

  // Message handling
  async sendMessage(groupId, messageData) {
    try {
      // Send plain text message to backend
      const response = await axios.post(`http://localhost:5001/api/groups/${groupId}/messages`, messageData);
      console.log('Message sent:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  async addReaction(groupId, messageId, userId, emoji) {
    try {
  await axios.post(`http://localhost:5001/api/groups/${groupId}/messages/${messageId}/reaction`, {
        userId,
        emoji
      });
    } catch (error) {
      console.error('Error adding reaction:', error);
      throw error;
    }
  }

  async removeReaction(messageId, userId, emoji) {
    try {
      const messageRef = doc(db, 'messages', messageId);
      await updateDoc(messageRef, {
        [`reactions.${emoji}`]: arrayRemove(userId)
      });
    } catch (error) {
      console.error('Error removing reaction:', error);
      throw error;
    }
  }

  // File handling
  async uploadFile(groupId, file, userId, text = '') {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', userId);
      formData.append('text', text);
      const response = await axios.post(`http://localhost:5001/api/groups/${groupId}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  async deleteFile(filePath) {
    try {
      const fileRef = ref(storage, filePath);
      await deleteObject(fileRef);
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }

  // Real-time listeners
  setupRealtimeListeners(userId, onMessage) {
    // Listen to messages in user's groups
    this.getUserGroups(userId).then(groups => {
      groups.forEach(group => {
        const q = query(
          collection(db, 'messages'),
          where('groupId', '==', group.id),
          orderBy('timestamp', 'desc')
        );
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const messages = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          onMessage(group.id, messages);
        });
        
        this.listeners.set(group.id, unsubscribe);
      });
    });
  }

  subscribeToGroupMessages(groupId, callback) {
    // Polling for demo/testing; in production use sockets or server-sent events
    let interval = setInterval(async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/groups/${groupId}/messages`);
        callback(response.data);
      } catch (error) {
        // Optionally handle error
      }
    }, 2000);
    return () => clearInterval(interval);
  }

  subscribeToGroups(userId, callback) {
    const q = query(
      collection(db, 'groups'),
      where('members', 'array-contains', userId),
      orderBy('updatedAt', 'desc')
    );
    
    return onSnapshot(q, (snapshot) => {
      const groups = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(groups);
    });
  }

  // Project integration
  async createProjectGroup(projectData) {
    const groupData = {
      name: `${projectData.name} - Project Chat`,
      description: `Chat group for ${projectData.name} project`,
      type: 'project',
      projectId: projectData.id,
      members: projectData.members || [],
      createdBy: projectData.createdBy,
      avatar: projectData.avatar || null,
      isPrivate: projectData.isPrivate || false
    };
    
    return await this.createGroup(groupData);
  }
}

export default new ChatService();
