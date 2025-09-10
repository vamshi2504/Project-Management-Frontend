// import React from 'react';
// import {
//   Modal,
//   ModalOverlay,
//   ModalContent,
//   ModalHeader,
//   ModalCloseButton,
//   ModalBody,
//   Text,
//   Flex,
//   Box,
// } from '@chakra-ui/react';
// import {
//   StreamVideoClient,
//   StreamVideoProvider,
//   StreamCall,
//   SpeakerLayout,
//   CallControls,
// } from '@stream-io/video-react-sdk';

const apiKey = import.meta.env.VITE_REACT_APP_STREAM_API_KEY;
const BACKEND_URL = import.meta.env.VITE_REACT_APP_CHAT_BACKEND_URL || 'http://localhost:5001';

// const VideoCallModal = ({ isOpen, onClose, user, projectId, projectName }) => {
//   const [videoClient, setVideoClient] = React.useState(null);
//   const [call, setCall] = React.useState(null);
//   const [connecting, setConnecting] = React.useState(false);
//   const [videoToken, setVideoToken] = React.useState(null);
//   const [error, setError] = React.useState(null);

//   React.useEffect(() => {
//     if (!isOpen || !user) return;
//     setVideoToken(null);
//     setError(null);

//     (async () => {
//       try {
//         const res = await fetch(`${BACKEND_URL}/video-token`, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ userId: user.uid }),
//         });
//         const data = await res.json();
//         data.token ? setVideoToken(data.token) : setError('Failed to fetch video token.');
//       } catch {
//         setError('Error fetching video token.');
//       }
//     })();
//   }, [isOpen, user]);

//   React.useEffect(() => {
//   if (!isOpen || !user || !videoToken || !apiKey) return;
//   let client, callObj;
//   let mounted = true;

//   (async () => {
//     setConnecting(true);
//     try {
//       client = new StreamVideoClient({
//         apiKey,
//         user: {
//           id: user.uid,
//           name: user.displayName || user.email,
//           image: user.photoURL || undefined,
//         },
//         tokenProvider: async () => videoToken,
//       });

//       if (!mounted) return;
//       const callId = `project-${projectId}`;
//       callObj = client.call('default', callId);
//       await callObj.join({ create: true });

//       setVideoClient(client);
//       setCall(callObj);
//     } catch (err) {
//       console.error('[VideoCallModal] Error connecting to video call:', err);
//       setError(err.message || 'Error connecting to video call.');
//     } finally {
//       setConnecting(false);
//     }
//   })();

//   return () => {
//     mounted = false;
//     callObj?.leave();
//     client?.disconnectUser();
//   };
// }, [isOpen, user, videoToken, projectId]);

//   if (!isOpen) return null;

//   console.log({ videoClient, call, isOpen, connecting, videoToken, error });

//   return (
//     <Modal isOpen={isOpen} onClose={onClose} size="6xl" isCentered>
//       <ModalOverlay />
//       <ModalContent bg="gray.900" color="white">
//         <ModalHeader>Video Call – {projectName}</ModalHeader>
//         <ModalCloseButton />
//         <ModalBody>
//           {error ? (
//             <Text color="red.400">{error}</Text>
//           ) : !videoToken ? (
//             <Text>Fetching video token...</Text>
//           ) : connecting ? (
//             <Text>Connecting to video call...</Text>
//           ) : videoClient && call ? (
//             <StreamVideoProvider client={videoClient}>
//               <StreamCall call={call}>
//                 <Box w="full" h="500px" bg="gray.800" borderRadius="xl" overflow="hidden">
//                   <SpeakerLayout />
//                   <CallControls onLeave={onClose} />
//                 </Box>
//               </StreamCall>
//             </StreamVideoProvider>
//           ) : (
//             <Text>Loading video call...</Text>
//           )}
//         </ModalBody>
//       </ModalContent>
//     </Modal>
//   );
// };

// export default VideoCallModal;


import { useEffect, useState } from 'react';
import {
  Call,
  CallControls,
  CallingState,
  SpeakerLayout,
  StreamCall,
  StreamTheme,
  StreamVideo,
  StreamVideoClient,
  useCallStateHooks,
} from '@stream-io/video-react-sdk';

import '@stream-io/video-react-sdk/dist/css/styles.css';
import './styles.css';

// For demo credentials, check out our video calling tutorial:
// https://getstream.io/video/sdk/react/tutorial/video-calling/
const userId = 'video-tutorial-' + Math.random().toString(16).substring(2);
const tokenProvider = (async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/video-token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.uid }),
        });
        const data = await res.json();
        data.token ? setVideoToken(data.token) : setError('Failed to fetch video token.');
      } catch {
        setError('Error fetching video token.');
      }
    })

const user = {
  id: userId,
  name: 'Oliver',
  image: 'https://getstream.io/random_svg/?id=oliver&name=Oliver',
};

// initialize the StreamVideoClient
const client = new StreamVideoClient({ apiKey, user, tokenProvider });

export default function App() {
  const [call, setCall] = useState();
  useEffect(() => {
    const myCall = client.call(
      'default',
      `video-tutorial-${Math.random().toString(16).substring(2)}`,
    );
    myCall.join({ create: true }).catch((err) => {
      console.error(`Failed to join the call`, err);
    });

    setCall(myCall);

    return () => {
      setCall(undefined);
      myCall.leave().catch((err) => {
        console.error(`Failed to leave the call`, err);
      });
    };
  }, []);

  if (!call) return null;

  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <UILayout />
      </StreamCall>
    </StreamVideo>
  );
}

export const UILayout = () => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  if (callingState !== CallingState.JOINED) {
    return <div>Loading...</div>;
  }

  return (
    <StreamTheme>
      <SpeakerLayout participantsBarPosition="bottom" />
      <CallControls />
    </StreamTheme>
  );
};