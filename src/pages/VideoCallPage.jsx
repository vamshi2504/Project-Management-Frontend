
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  StreamVideoClient,
  StreamVideoProvider,
  StreamCall,
  SpeakerLayout,
  CallControls,
  StreamTheme,
} from '@stream-io/video-react-sdk';
import '@stream-io/video-react-sdk/dist/css/styles.css';
import './styles.css';
import { useUser } from '../hooks/useUser';
import { fetchProjectById } from '../api/projects';

const apiKey = import.meta.env.VITE_REACT_APP_STREAM_API_KEY;
const BACKEND_URL = import.meta.env.VITE_REACT_APP_CHAT_BACKEND_URL || 'http://localhost:5001';

const VideoCallPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const [project, setProject] = useState(null);
  const [videoToken, setVideoToken] = useState(null);
  const [videoClient, setVideoClient] = useState(null);
  const [call, setCall] = useState(null);
  const [error, setError] = useState(null);

  // Fetch project info
  useEffect(() => {
    if (!projectId) return;
    fetchProjectById(projectId)
      .then((proj) => setProject(proj))
      .catch(() => setProject(null));
  }, [projectId]);

  // Fetch video token
  useEffect(() => {
    if (!user) return;
    const fetchToken = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/video-token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.uid }),
        });
        const data = await res.json();
        setVideoToken(data.token);
      } catch (err) {
        setError('Failed to fetch video token');
      }
    };
    fetchToken();
  }, [user]);

  // Setup video client and call
  useEffect(() => {
    if (!user || !videoToken || !apiKey) return;
    const client = new StreamVideoClient({
      apiKey,
      user: {
        id: user.uid,
        name: user.displayName || user.email,
        image: user.photoURL || undefined,
      },
      token: videoToken,
    });
    setVideoClient(client);
    const callId = `project-${projectId}`;
    const call = client.call('default', callId, {
      members: project?.teamMembers?.map((m) => ({ user_id: m.userId })) || [user.uid],
    });
    call.join({ create: true })
      .then(() => setCall(call))
      .catch(() => setError('Failed to join call'));
    return () => {
      call.leave();
      client.disconnectUser();
    };
  }, [user, videoToken, apiKey, projectId, project]);

  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!project || !videoClient || !call) return <div>Loading video call...</div>;

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#181818' }}>
      <StreamVideoProvider client={videoClient}>
        <StreamCall call={call}>
          <StreamTheme>
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <SpeakerLayout participantsBarPosition="bottom" />
              <CallControls
                showScreenShareButton
                showSettingsButton
                showParticipantsButton
                showCallRecordingButton
                onLeave={() => navigate('/chat')}
                style={{ marginTop: 'auto', background: '#23272f', borderRadius: 8 }}
              />
            </div>
          </StreamTheme>
        </StreamCall>
      </StreamVideoProvider>
    </div>
  );
};

export default VideoCallPage;

