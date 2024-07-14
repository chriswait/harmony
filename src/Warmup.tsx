import {
  Box,
  Button,
  Flex,
  Heading,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { default as AudioPlayer, default as H5AudioPlayer } from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import ReactPlayer from 'react-player';

import WarmupSong from './assets/warmup.mp3';

const WarmupModalContent = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<H5AudioPlayer>(null);
  const audio = audioRef.current?.audio.current;
  useEffect(() => {
    if (audio) {
      if (isPlaying) {
        audio.play();
      } else {
        audio.pause();
      }
    }
  }, [audio, isPlaying]);
  useEffect(() => {
    setIsPlaying(true);
  }, []);
  return (
    <ModalContent>
      <ModalHeader>
        <Flex alignItems="center" columnGap={4}>
          <Heading>Warmup</Heading>
          <Button onClick={() => setIsPlaying(!isPlaying)}>
            {isPlaying ? 'Pause' : 'Play'}
          </Button>
        </Flex>
      </ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Box mb={4}>
          <AudioPlayer
            src={WarmupSong}
            autoPlay={isPlaying}
            // onPlay={(e) => console.log('onPlay')}
            showJumpControls={false}
            customControlsSection={[]}
            ref={audioRef}
          />
        </Box>
        <ReactPlayer
          url="https://youtu.be/BTJmydT_Ioc?si=IW9baAZj_g7D4-Rl&t=12"
          playing={isPlaying}
          muted
          width={'100%'}
        />
      </ModalBody>
    </ModalContent>
  );
};

export default WarmupModalContent;
